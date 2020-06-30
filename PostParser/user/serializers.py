from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_jwt.settings import api_settings

class GetFullUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','email','is_active','is_superuser','first_name', 'last_name')

class UserSerializerWithToken(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    token = serializers.SerializerMethodField()
    def get_token(self, object):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(object)
        token = jwt_encode_handler(payload)
        return token
    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create(
            username = validated_data['username'],
            first_name = validated_data['first_name'] if 'first_name' in validated_data else "",
            last_name = validated_data['last_name'] if 'last_name' in validated_data else "",
        )
        user.set_password(validated_data['password'])
        user.is_active = False
        if 'email' in validated_data:
            print("here")
            user.email = validated_data["email"]
        user.save()
        return user
    
    class Meta:
        model = User
        fields = ('token', 'email', 'username', 'password', 'first_name',
        'last_name')