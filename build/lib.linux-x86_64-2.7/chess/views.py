from django.views.generic import TemplateView

class ChessView(TemplateView):
    ROW_COUNT = 8
    BLOCK_COUNT = ROW_COUNT * ROW_COUNT
    HEIGHT = WIDTH = 50
    
    def get_context_data(self, *args, **kwargs):
        context = super(ChessView, self).get_context_data(*args, **kwargs)
        
        context['margin_left'] = self.ROW_COUNT * self.WIDTH/2
        context['margin_top'] = self.ROW_COUNT * self.HEIGHT/2
        context['playarea_width'] = self.ROW_COUNT * self.WIDTH
        context['playarea_height'] = self.ROW_COUNT * self.HEIGHT
        context['width'] = self.WIDTH
        context['height'] = self.HEIGHT
        
        context['tab'] = 'game'
        
        j = 0
        k = 0
        css = ''
        html = ''
        
        i = 0
        
        while i < self.BLOCK_COUNT:
            top = j * self.HEIGHT;
            left = k * self.WIDTH;

            if (i + 1) % self.ROW_COUNT == 0 and i != 0:
                j += 1
                k = 0
            else:
                k = k + 1;

            i = i + 1
            
        context['css'] = css

        uneven = [0, 2, 4, 6, 9, 11, 13, 15, 16, 18, 20, 22, 25, 27, 29, 31, 32, 34, 36, 38, 41, 43, 45, 47, 48, 50, 52, 54, 57, 59, 61, 63]
        uneven = set(uneven)

        i = 0
        
        while i < self.BLOCK_COUNT:
            html += '<div class="block_%s block' % str(i)
            if i in uneven:
                html += ' uneven'
            html += '">'

            if i < 16 or i > 47:
                if i == 0 or i == 7:
                    img = '&#9820;'
                if i == 1 or i == 6:
                    img = ' &#9822;'
                if i == 2 or i == 5:
                    img = '&#9821;'
                if i == 3:
                    img = '&#9819;'
                if i == 4:
                    img = ' &#9818;'
                if i > 7 and i < 16:
                    img = '&#9823;'
                if i == 56 or i == 63:
                    img = ' &#9814;'
                if i == 57 or i == 62:
                    img = ' &#9816;'
                if i == 58 or i == 61:
                    img = '&#9815;'
                if i == 59:
                    img = '&#9813;'
                if i == 60:
                    img = ' &#9812;'
                if i > 47 and i < 56:
                    img = '&#9817;'
            else:
                img = '&nbsp;'

            html += img

            html += '</div>'
            
            i = i + 1

        context['html'] = html

        return context