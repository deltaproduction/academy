from rest_framework import serializers

from courses.models import Course, Task, Topic


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
    tasks = TaskListSerializer(many=True)

    class Meta:
        model = Topic
        fields = ['id', 'course', 'title', 'tasks', 'type', 'description', 'state', 'start', 'end']
        read_only_fields = ['id']


class GroupTopicSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, source="task_set")

    class Meta:
        model = Topic
        fields = ['id', 'course', 'title', 'type', 'description', 'state', 'start', 'end', 'tasks']
        read_only_fields = ['id']
