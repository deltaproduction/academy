from datetime import datetime

from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken


def set_token_cookie(response, token):
    cookie_name = None
    if isinstance(token, RefreshToken):
        cookie_name = settings.REFRESH_TOKEN_COOKIE_NAME
    if isinstance(token, AccessToken):
        cookie_name = settings.ACCESS_TOKEN_COOKIE_NAME

    assert cookie_name is not None, 'Token must be an instance of RefreshToken or AccessToken'

    if response.cookies.get(cookie_name) is None:
        response.set_cookie(
            key=cookie_name,
            value=str(token),
            expires=datetime.fromtimestamp(token.payload["exp"]),
            httponly=True,
            samesite="strict"
        )
