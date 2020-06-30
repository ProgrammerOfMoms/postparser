from django.contrib import admin
from django.urls import path, include, re_path
from poster.views import FrontendAppView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('posts/', include("poster.urls")),
    path('user/', include("user.urls")),
    re_path(r'^', FrontendAppView.as_view())
]
