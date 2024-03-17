from django.http import JsonResponse
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated

from utils.utils import run_code


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_code_view(request, task_id):
    result = run_code(request.data.get('code'))
    return JsonResponse({'code': task_id, 'result': result})
