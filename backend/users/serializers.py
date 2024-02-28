from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'groups']


class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(validators=[validate_password])
    confirm_password = serializers.CharField()

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'confirm_password']

    def validate(self, attrs):
        if attrs['confirm_password'] != attrs['password']:
            raise serializers.ValidationError({'confirm_password': 'Пароли не совпадают'})
        del attrs['confirm_password']
        attrs['password'] = make_password(attrs['password'])
        return attrs


class SignInSerializer(serializers.Serializer):
    user = None
    email = serializers.CharField(max_length=32, required=True)
    password = serializers.CharField(max_length=32, required=True)

    def validate(self, attrs):
        user = authenticate(self.context.get('request'), **attrs)
        if not user:
            raise serializers.ValidationError({'password': 'Неверный логин или пароль'})
        self.user = user
        return attrs

    class Meta:
        fields = ['email', 'password']
