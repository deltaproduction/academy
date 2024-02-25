from django.http import HttpRequest
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from app.settings import ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME
from utils.api_auth.helpers import set_token_cookie


def _get_request_access_token(request: HttpRequest):
    try:
        return AccessToken(request.COOKIES[ACCESS_TOKEN_COOKIE_NAME])
    except (TokenError, KeyError):
        return None


def _get_request_refresh_token(request: HttpRequest):
    try:
        return RefreshToken(request.COOKIES[REFRESH_TOKEN_COOKIE_NAME])
    except (TokenError, KeyError):
        return None


class JWTMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest):
        access_token = _get_request_access_token(request)
        refresh_token = _get_request_refresh_token(request)

        renew_claims = bool(access_token is None and refresh_token)

        if renew_claims:
            refresh_token.set_exp()
            refresh_token.set_iat()
            refresh_token.set_exp()
            access_token = refresh_token.access_token

        request.access_token = access_token

        response = self.get_response(request)

        if renew_claims:
            set_token_cookie(response, access_token)
            set_token_cookie(response, refresh_token)

        return response
