from django.urls import path, include
from .views import *
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    path('', UserListAPIView.as_view()),
    path('login/', obtain_jwt_token),
    path('current_user/', GetCurrentUserView.as_view()),
    path('create/', CreateUserView.as_view()),
]

