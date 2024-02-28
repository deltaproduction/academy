from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()


class JWTCookieAuthentication(BaseAuthentication):
    def authenticate(self, request):
        if isinstance(request.access_token, AccessToken):
            try:
                user_id = request.access_token.payload.get("user")['id']
                return User.objects.get(id=user_id), request.access_token
            except User.DoesNotExist:
                pass

    def authenticate_header(self, request):
        return 'JWT'
