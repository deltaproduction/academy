from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import serializers

from courses.models import Course, Task, Topic, TestCase, Attempt
from users.serializers import StudentSerializer
from utils.code_runner import run_code_with_timeout, TimeoutExpired

User = get_user_model()


class CourseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title']


class CourseDetailSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user.teacher
        return super().create(validated_data)

    class Meta:
        model = Course
        fields = ['id', 'title', 'state', 'description', 'author']
        read_only_fields = ['id', 'author']


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'topic', 'title', 'text', 'format_in_text', 'format_out_text', 'autoreview']


class TaskListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'topic', 'title', 'autoreview']


class TopicSerializer(serializers.ModelSerializer):
    tasks = TaskListSerializer(many=True, read_only=True)

    class Meta:
        model = Topic
        fields = ['id', 'course', 'title', 'tasks', 'type', 'description', 'state', 'start', 'end']
        read_only_fields = ['id']


class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = ['id', 'task', 'stdin', 'stdout', 'timelimit']
        read_only_fields = ['id']


class AttemptSerializer(serializers.ModelSerializer):
    task = TaskListSerializer(read_only=True)
    student = StudentSerializer(read_only=True)
    test_case = TestCaseSerializer(read_only=True)

    def save(self, **kwargs):
        try:
            student = self.context['request'].user.student
            task = self.context['request'].data.get('task')
            task = Task.objects.get(id=task)
            attempt = Attempt.objects.filter(task=task, student=student)
            if attempt.exists():
                self.instance = attempt.first()

            kwargs['student'] = student
            kwargs['task'] = task
            kwargs['status'] = Attempt.ON_REVIEW
            kwargs['output'] = ''
            kwargs['test_case'] = None
            kwargs['created_at'] = timezone.now()

            if task.autoreview:
                for test_case in TestCase.objects.filter(task_id=task).all():
                    try:
                        success, output = run_code_with_timeout(
                            self.validated_data['code'], test_case.stdin, test_case.timelimit
                        )
                    except TimeoutExpired:
                        kwargs['status'] = Attempt.TIMEOUT_ERROR
                        kwargs['output'] = 'Timeout error'
                        kwargs['test_case'] = test_case
                        break
                    else:
                        if not success:
                            kwargs['status'] = Attempt.SYNTAX_ERROR
                            kwargs['output'] = output
                            kwargs['test_case'] = test_case
                            break
                        elif output != test_case.stdout:
                            kwargs['status'] = Attempt.INVALID_RESULT
                            kwargs['output'] = output
                            kwargs['test_case'] = test_case
                            break
                else:
                    kwargs['status'] = Attempt.SUCCESS
        except User.student.RelatedObjectDoesNotExist:
            kwargs['status'] = self.context['request'].data.get('status')

        return super().save(**kwargs)

    class Meta:
        model = Attempt
        fields = ['id', 'student', 'task', 'code', 'output', 'status', 'test_case', 'created_at']
        read_only_fields = ['id', 'task', 'status', 'student', 'output', 'test_case', 'created_at']
