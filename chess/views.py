import json
import time

from datetime import datetime

from django.db.models import Q, F
from django.views.generic import TemplateView
from django.conf import settings
from django.http import HttpResponse
from django.contrib.auth.models import User, AnonymousUser

from chess.models import Move, Invitation

class MoveView(TemplateView):
    def get(self, request, *arg, **kwargs):
        move_title = request.GET.get('move')
        pk = request.GET.get('pk')
        
        invitation = Invitation.objects.get(pk=pk)
        
        if move_title:
            fromXY = int(request.GET.get('from'))
            toXY = int(request.GET.get('to'))
            
            m = Move(
                invitation=invitation,
                user=request.user,
                move=move_title,
                fromXY=fromXY,
                toXY=toXY
            )
            
            m.save()
        
        try:
            move = Move.objects.filter(invitation=invitation).order_by('-created')[0]
        except IndexError:
            move = None
            
        while move is None or(move is not None and move.user == request.user):
            try:
                move = Move.objects.filter(invitation=invitation).order_by('-created')[0]
            except IndexError:
                move = None

            time.sleep(1)
            
        return HttpResponse(json.dumps({'fromXY': move.fromXY, 'toXY': move.toXY}))

class AcceptorRejectView(TemplateView):
    def get(self, request, *arg, **kwargs):
        pk = request.GET.get('pk')
        accept = request.GET.get('accept')
        reject = request.GET.get('reject')
        
        invitation = Invitation.objects.get(pk=pk)
        
        if accept:
            invitation.accepted = True
        
        if reject:
            invitation.rejected = True
        
        invitation.save()
        
        return HttpResponse(json.dumps({'invitation': invitation.pk}))
        
class InvitationView(TemplateView):
    def get(self, request, *arg, **kwargs):
        to_user = User.objects.get(username=request.GET.get('to_user'))
        
        invitation = Invitation(
            to_user=to_user,
            from_user=request.user
        )
        
        invitation.save();
        
        pk = invitation.pk
        
        while invitation.accepted == False and invitation.rejected == False:
            invitation = Invitation.objects.get(pk=pk)
            time.sleep(1)
            
        return HttpResponse(json.dumps({'pk': invitation.pk, 'accepted': invitation.accepted, 'rejected': invitation.rejected}))

class InvitationListView(TemplateView):
    def get(self, request, *arg, **kwargs):
        direction = request.GET.get('direction')
        
        if direction == 'from':
            filter_kwargs = {
                'from_user': request.user
            }
        else:
            filter_kwargs = {
                'to_user': request.user
            }
            
        filter_kwargs['accepted'] = False
        filter_kwargs['rejected'] = False
        
        count = 0
        
        while count == 0:
            invitations = tuple(Invitation.objects.filter(**filter_kwargs).values_list('pk', 'from_user__username', 'accepted', 'rejected'))
            
            count = invitations.count

            time.sleep(1)
            
        return HttpResponse(json.dumps({'invitations': invitations}))
        
class ChessView(TemplateView):
    ROW_COUNT = 8
    BLOCK_COUNT = ROW_COUNT * ROW_COUNT
    HEIGHT = WIDTH = 60
    
    def get(self, request, *args, **kwargs):
        self.user = request.user
        
        return super(ChessView, self).get(request, *args, **kwargs)
        
    def get_context_data(self, *args, **kwargs):
        context = super(ChessView, self).get_context_data(*args, **kwargs)
        
        row_count = self.ROW_COUNT + 1
        
        context['margin_left'] = row_count * self.WIDTH/2
        context['margin_top'] = row_count * self.HEIGHT/2
        context['playarea_width'] = row_count * self.WIDTH
        context['playarea_height'] = row_count * self.HEIGHT
        context['container_width'] = context['playarea_width'] - self.WIDTH
        context['container_height'] = context['playarea_height'] - self.HEIGHT
        context['width'] = self.WIDTH
        context['height'] = self.HEIGHT
        context['users'] = User.objects.exclude(username=self.user.username).order_by('-last_login')
        
        j = 0
        k = 1
        css = ''
        html = ''
        
        i = 0
        
        while i < self.BLOCK_COUNT:
            top = j * self.HEIGHT;
            left = k * self.WIDTH;

            css +=  '.block_' + str(i) + '{ top: ' + str(top) + 'px;' + 'left: ' + str(left) + 'px; }'

            if (i + 1) % self.ROW_COUNT == 0 and i != 0:
                css += '.y_' + str(j) + '{ top: ' + str(top) + 'px; left: 0px; }';
                j += 1
                k = 1;
            else:
                k += 1
            
            if i == (self.BLOCK_COUNT - 1):
                top = j * self.HEIGHT;
                
                for l in range(0, 9):
                    left = l * self.WIDTH;
                    css += '.x_%s{ top: %spx; left: %spx; }' % (str(l), str(top), (left))
                    
            i += 1
            
        context['css'] = css

        uneven = [0, 2, 4, 6, 9, 11, 13, 15, 16, 18, 20, 22, 25, 27, 29, 31, 32, 34, 36, 38, 41, 43, 45, 47, 48, 50, 52, 54, 57, 59, 61, 63]
        uneven = set(uneven)

        i = 0
        k = 0
        
        for i in range(0, 9):
            html += '<div class="y_%s y">%s</div>' % (i, self.ROW_COUNT - i)
        
        html += '<div class="container">';
        
        i = 0
        
        while i < self.BLOCK_COUNT:
            html += '<div class="block_%s block' % str(i)
            if i in uneven:
                html += ' uneven'
            html += '">'
            
            if i < 16 or i > 47:
                if i == 0 or i == 7:
                    img = 'black/rook.png'
                if i == 1 or i == 6:
                    img = 'black/knight.png'
                if i == 2 or i == 5:
                    img = 'black/bishop.png'
                if i == 3:
                    img = 'black/queen.png'
                if i == 4:
                    img = 'black/king.png'
                if i > 7 and i < 16:
                    img = 'black/pawn.png'
                if i == 56 or i == 63:
                    img = 'white/rook.png'
                if i == 57 or i == 62:
                    img = 'white/knight.png'
                if i == 58 or i == 61:
                    img = 'white/bishop.png'
                if i == 59:
                    img = 'white/queen.png'
                if i == 60:
                    img = 'white/king.png'
                if i > 47 and i < 56:
                    img = 'white/pawn.png'

                html += '<img src="%simg/pieces/%s" width="%s" height="%s" />' % (settings.STATIC_URL, img, str(self.WIDTH), str(self.HEIGHT))

            html += '</div>'
            
            i = i + 1
        
        html += '</div>'
        
        l = ['&nbsp;', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        
        for i in range(0, 9):
            html += '<div class="x_%s x">%s</div>' % (i, l[i])
            
        context['html'] = html

        return context