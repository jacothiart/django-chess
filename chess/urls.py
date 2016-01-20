from django.conf.urls import patterns, include, url

from project.chess.views import ChessView

urlpatterns = patterns('',
    url(r'^chess/$', ChessView.as_view(template_name='chess.html'), name='chess'),
)
