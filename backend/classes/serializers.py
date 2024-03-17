from random import randrange

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from classes.models import Group, GroupStudent
from courses.serializers import CourseDetailSerializer
from users.serializers import UserSerializer, StudentSerializer


class GroupListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'title', 'code']


class GroupDetailSerializer(serializers.ModelSerializer):
    students = StudentSerializer(many=True, read_only=True)
    course = serializers.SerializerMethodField()

    def __generate_code(self):
        code = randrange(1000000, 9999999)
        if Group.objects.filter(code=code).exists():
            return self.__generate_code()
        return code

    def get_course(self, obj):
        group_course = obj.group_courses.filter(active=True).first()
        if not group_course:
            return None
        return CourseDetailSerializer(instance=group_course.course).data

    def create(self, validated_data):
        validated_data['code'] = self.__generate_code()
        validated_data['tutor'] = self.context['request'].user.teacher
        return super().create(validated_data)

    class Meta:
        model = Group
        fields = ['id', 'title', 'course', 'students', 'tutor', 'teacher_name', 'code']
        read_only_fields = ['id', 'course', 'students', 'tutor', 'code']


class GroupStudentCreateSerializer(serializers.ModelSerializer):
    group = serializers.CharField()

    def validate_group(self, value):
        group = Group.objects.filter(code=value)
        if not group.exists():
            raise ValidationError("Класса с таким кодом не существует")

        group = group.first()
        if GroupStudent.objects.filter(
            student=self.context['request'].user.student,
            group=group
        ).exists():
            raise ValidationError("Вы уже зачислены этот класс")
        return group

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user.student
        return super().create(validated_data)

    class Meta:
        model = GroupStudent
        fields = ['group']
