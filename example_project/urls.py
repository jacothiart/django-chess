from django.conf.urls.defaults import *
from django.conf import settings
from django.contrib import admin

import chess

admin.autodiscover()

urlpatterns = patterns('',
    (r'', include(chess.urls)),
    (r'^admin/', include(admin.site.urls)),

    (r'^media/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.MEDIA_ROOT}),
)
