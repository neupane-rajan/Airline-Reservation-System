from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 
            'username', 
            'email', 
            'password', 
            'first_name', 
            'last_name'
        ]
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True}
        }

    def create(self, validated_data):
        # Create user with hashed password
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

    def validate_username(self, value):
        # Additional username validation
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value