from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.tokens import RefreshToken

from users.serializers import UserSerializer, SignInSerializer, SignUpSerializer
from utils.api_auth.auth_backends import JWTCookieAuthentication
from utils.api_auth.helpers import set_token_cookie

User = get_user_model()


def get_user_refresh_token(user):
    refresh_token = RefreshToken()
    refresh_token['user'] = UserSerializer(user).data
    return refresh_token


@api_view(['POST'])
def sign_up_view(request):
    serializer = SignUpSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    user = serializer.instance

    response = Response(UserSerializer(user).data)

    refresh_token = get_user_refresh_token(user)

    set_token_cookie(response, refresh_token)
    set_token_cookie(response, refresh_token.access_token)

    return response


@api_view(['POST'])
def sign_in_view(request):
    serializer = SignInSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)

    user = serializer.user

    user_serialized_data = UserSerializer(user).data

    response = Response(user_serialized_data)

    refresh_token = get_user_refresh_token(user)

    set_token_cookie(response, refresh_token)
    set_token_cookie(response, refresh_token.access_token)

    return response


@api_view()
@permission_classes([IsAuthenticated])
def profile(request):
    user = User.objects.get(id=request.user.id)
    return Response(UserSerializer(user).data)
