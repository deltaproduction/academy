from django.contrib.auth import get_user_model

from rest_framework import serializers, response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "groups"]


@api_view()
@permission_classes([IsAuthenticated])
def profile(request):
    user = User.objects.get(id=request.user.id)
    return response.Response(UserSerializer(user).data)
