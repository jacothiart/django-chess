from django.conf.urls.defaults import *
from django.conf import settings
from django.contrib import admin
from django.contrib.auth.decorators import login_required

from chess.views import ChessView, MoveView, InvitationView, InvitationListView, AcceptorRejectView

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', login_required(ChessView.as_view(template_name='chess.html')), name='chess'),
    url(r'^move$', login_required(MoveView.as_view(template_name='chess.html')), name='move'),
    url(r'^invite$', login_required(InvitationView.as_view(template_name='chess.html')), name='invites'),
    url(r'^invite-list$', login_required(InvitationListView.as_view(template_name='chess.html')), name='invite_list'),
    url(r'^accept-or-reject$', login_required(AcceptorRejectView.as_view(template_name='chess.html')), name='accept_pr_reject'),
    url(r'^login/$', 'django.contrib.auth.views.login', name='login'),
    url(r'^logout/$', 'django.contrib.auth.views.logout', name='logout'),

    (r'^admin/', include(admin.site.urls)),
)
