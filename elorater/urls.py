from django.contrib import admin
from django.urls import path, include, re_path
from frontend.views import index
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rater.views import UserAPIView

urlpatterns = [
    path('', index),
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name = 'token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name = 'token_refresh'),
    path('api/user/', UserAPIView.as_view(), name = 'user'),
    re_path('api/(?P<version>(v1|v2))/', include('rater.urls')),
    re_path('api/(?P<version>(v1|v2))/', include('surveyor.urls')),
]
