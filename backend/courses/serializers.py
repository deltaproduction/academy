from rest_framework import serializers

from courses.models import Course, Task, Topic, TestCase, Attempt
from utils.code_runner import run_code_with_timeout, TimeoutExpired


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
        fields = ['id', 'topic', 'title', 'text', 'format_in_text', 'format_out_text']


class TaskListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'topic', 'title']


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
    test_case = TestCaseSerializer(read_only=True)

    def create(self, validated_data):
        if 'test_case' in validated_data:
            del validated_data['test_case']

        validated_data['student'] = self.context['request'].user.student
        for test_case in TestCase.objects.filter(task_id=validated_data['task']).all():
            try:
                success, output = run_code_with_timeout(
                    validated_data['code'], test_case.stdin, test_case.timelimit
                )
            except TimeoutExpired:
                validated_data['status'] = Attempt.TIMEOUT_ERROR
                validated_data['output'] = 'Timeout error'
                validated_data['test_case'] = test_case
                return super().create(validated_data)
            else:
                if not success:
                    validated_data['status'] = Attempt.SYNTAX_ERROR
                    validated_data['output'] = output
                    validated_data['test_case'] = test_case
                    return super().create(validated_data)
                if output != test_case.stdout:
                    validated_data['status'] = Attempt.INVALID_RESULT
                    validated_data['output'] = output
                    validated_data['test_case'] = test_case
                    return super().create(validated_data)

        validated_data['status'] = Attempt.SUCCESS

        return super().create(validated_data)

    class Meta:
        model = Attempt
        fields = ['id', 'task', 'code', 'output', 'status', 'test_case']
        read_only_fields = ['id', 'output', 'status', 'test_case']
