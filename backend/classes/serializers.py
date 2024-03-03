from random import randrange

from rest_framework import serializers

from classes.models import Class


class ClassCodeDefault:
    def __call__(self):
        code = randrange(1000000, 9999999)
        if Class.objects.filter(code=code).exists():
            return self()
        return code

    def __repr__(self):
        return '%s()' % self.__class__.__name__


class ClassSerializer(serializers.ModelSerializer):
    def __generate_code(self):
        code = randrange(1000000, 9999999)
        if Class.objects.filter(code=code).exists():
            return self.__generate_code()
        return code

    def create(self, validated_data):
        validated_data['code'] = self.__generate_code()
        validated_data['tutor'] = self.context['request'].user
        return super().create(validated_data)

    class Meta:
        model = Class
        fields = ['title', 'course', 'tutor', 'code']
        read_only_fields = ['tutor', 'code']