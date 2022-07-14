from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Experiment, Results, People, Final_Results, Comments
from django.contrib.auth import get_user_model


class NewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username')

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class ExperimentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Experiment
		fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Comments
		fields = '__all__'


class PeopleSerializer(serializers.ModelSerializer):
	class Meta:
		model = People
		fields = '__all__'

class Final_ResultsSerializer(serializers.ModelSerializer):
	names = serializers.StringRelatedField(read_only= True)

	class Meta:
		model = Final_Results
		fields = '__all__'


class ResultsSerializer(serializers.ModelSerializer):
	name_1 = PeopleSerializer()
	name_2 = PeopleSerializer()
	rater = PeopleSerializer()

	class Meta:
		model = Results
		fields = '__all__'
