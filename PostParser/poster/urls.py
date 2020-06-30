from django.urls import path
from .views import PostList

urlpatterns = [
    path('get/', PostList.as_view()),
]
