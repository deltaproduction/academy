from random import randrange

from rest_framework import serializers

from classes.models import Group, GroupStudent
from users.serializers import UserSerializer, StudentSerializer


class GroupListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'title']


class GroupDetailSerializer(serializers.ModelSerializer):
    students = StudentSerializer(many=True, read_only=True)

    def __generate_code(self):
        code = randrange(1000000, 9999999)
        if Group.objects.filter(code=code).exists():
            return self.__generate_code()
        return code

    def create(self, validated_data):
        validated_data['code'] = self.__generate_code()
        validated_data['tutor'] = self.context['request'].user.teacher
        return super().create(validated_data)

    class Meta:
        model = Group
        fields = ['id', 'title', 'courses', 'students', 'tutor', 'teacher_name', 'code']
        read_only_fields = ['id', 'courses', 'students', 'tutor', 'code']


class GroupStudentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupStudent
        fields = ['group', 'student']
