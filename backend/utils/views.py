from django.contrib.auth import get_user_model, authenticate

from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework_simplejwt.tokens import RefreshToken

from utils.api_auth.helpers import set_token_cookie

User = get_user_model()


class LoginView(GenericAPIView):
    @staticmethod
    def post(request, *args, **kwargs):
        user = authenticate(request, **request.data)

        response = Response({"username": user.username})

        refresh_token = RefreshToken.for_user(user)

        set_token_cookie(response, refresh_token)
        set_token_cookie(response, refresh_token.access_token)

        return response
