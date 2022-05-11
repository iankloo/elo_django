from django.contrib import admin
from django.urls import path, include, re_path
from frontend.views import index

urlpatterns = [
    path('', index),
    path('admin/', admin.site.urls),
    re_path('api/(?P<version>(v1|v2))/', include('rater.urls')),
    re_path('api/(?P<version>(v1|v2))/', include('surveyor.urls')),
]