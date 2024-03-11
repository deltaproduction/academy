from rest_framework import serializers

from courses.models import Course, Topic


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


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'course', 'title', 'type', 'description', 'state', 'start', 'end']
        read_only_fields = ['id']
