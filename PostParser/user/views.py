from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework.authentication import SessionAuthentication

from .serializers import *
from .models import UserIP, IP
from .actions import get_client_ip


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return None

class UserListAPIView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = GetFullUserSerializer
    authentication_classes = (CsrfExemptSessionAuthentication,)

class GetCurrentUserView(APIView):
    authentication_classes = (CsrfExemptSessionAuthentication,)
    def get(self, request):
        serializer = GetFullUserSerializer(request.user)
        return Response(serializer.data)

class CreateUserView(APIView):
    authentication_classes = (CsrfExemptSessionAuthentication,)
    permission_classes = (permissions.AllowAny, )
    def post(self,request):
        user = request.data.get('user')
        if not user:
            return Response({'response' : 'error', 'message' : 'No data found'})
        serializer = UserSerializerWithToken(data = user)
        if serializer.is_valid():
            saved_user = serializer.save()
        else:
            return Response({"response" : "error", "message" : serializer.errors})
        return Response({"response" : "success", "message" : "user created succesfully"})

class UserAfterLogin(APIView):
    def get(self, request):
        user = request.user
        ip = get_client_ip(request)
        try:
            user_ip, _ = UserIP.objects.get_or_create(user=user)
            IP.objects.get_or_create(user=user_ip, ip=ip)
            return Response(status = status.HTTP_200_OK)
        except:
            raise

        

