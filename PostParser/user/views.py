from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

class UserListAPIView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = GetFullUserSerializer

class GetCurrentUserView(APIView):
    def get(self, request):
        serializer = GetFullUserSerializer(request.user)
        return Response(serializer.data)

class CreateUserView(APIView):
    permission_classes = (permissions.AllowAny, )
    def post(self,request):
        user = request.data.get('user')
        if not user:
            return Response({'response' : 'error', 'message' : 'No data found'})
        print(user)
        serializer = UserSerializerWithToken(data = user)
        if serializer.is_valid():
            saved_user = serializer.save()
        else:
            return Response({"response" : "error", "message" : serializer.errors})
        return Response({"response" : "success", "message" : "user created succesfully"})
