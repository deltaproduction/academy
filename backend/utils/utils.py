import os
import random
import subprocess
import uuid

from django.shortcuts import get_object_or_404
from django.conf import settings

from courses.models import Task


def put_code_in_created_file(code: str):
    code_file_path = os.path.join(settings.CODE_FILES_PATH, f"code_{uuid.uuid4()}.py")
    with open(code_file_path, "a+") as code_file:
        code_file.write(code)
    return code_file_path


def get_tcs_file_path():
    tcs_files_path = os.path.join(settings.BASE_DIR, settings.TCS_FILES_PATH)

    tcs_token = str(random.randint(1000000, 9999999))
    while tcs_token in os.listdir(tcs_files_path):
        tcs_token = str(random.randint(1000000, 9999999))
    return os.path.join(tcs_files_path, tcs_token)


def run_code(code, stdin=None, max_time=2):
    code_file_path = put_code_in_created_file(code)

    process = subprocess.Popen(
        ["python3", code_file_path],
        stdin=stdin,
        stdout=subprocess.PIPE
    )

    with process as proc:
        try:
            proc.wait(timeout=max_time)
            output = process.communicate()[0].decode()
            return output
        except subprocess.TimeoutExpired:
            proc.terminate()
            proc.wait()

    os.remove(code_file_path)
    return None


def check_code(task_id, code):
    task = get_object_or_404(Task, pk=task_id)
    test_cases = task.testcase_set.all()

    tcs_file_path = get_tcs_file_path()

    for case in test_cases:
        # TODO: удалить некрасивый eval, когда stdin/stdout будет храниться в json
        stdin, stdout, timelimit = eval(f'"{case.in_args}"'), eval(f'"{case.stdout}"'), case.timelimit

        with open(tcs_file_path, "w", encoding="utf8") as tcs_file:
            tcs_file.write(stdin)

        stdin = open(tcs_file_path, "r", encoding="utf8", newline='\n')
        output = run_code(code, stdin, timelimit)
        if output != stdout:
            return False

    os.remove(tcs_file_path)
    return True
