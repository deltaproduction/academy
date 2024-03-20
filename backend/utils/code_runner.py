import subprocess


class TimeoutExpired(BaseException):
    pass


class CodeSyntaxError(BaseException):
    pass


def run_code_with_timeout(code, stdin, timeout=2):
    try:
        result = subprocess.run(
            ['python', '-c', code],
            input=stdin,
            capture_output=True,
            text=True,
            timeout=timeout
        )
        if result.stderr:
            return False, result.stderr.strip()
        return True, result.stdout.strip()
    except subprocess.TimeoutExpired:
        raise TimeoutExpired()
