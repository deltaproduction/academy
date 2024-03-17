from django.http import JsonResponse
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated

from courses.models import TestCase
from utils.code_runner import run_code_with_timeout


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_code_view(request, task_id):
    code = request.data.get('code')
    for test_case in TestCase.objects.filter(task_id=task_id).all():
        success, output = run_code_with_timeout(code, test_case.stdin)
        if not success:
            return JsonResponse(dict(success=False, result=output))
        if output != test_case.stdout:
            return JsonResponse(dict(
                success=False,
                result=f'Неверный ответ',
                args=test_case.stdin,
                output=output,
                expected=test_case.stdout
            ))
    return JsonResponse(dict(success=True))
