from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Experiment, Results, People, Results_Closeness, Experiment_Closeness
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


class ExperimentClosenessSerializer(serializers.ModelSerializer):
	class Meta:
		model = Experiment_Closeness
		fields = '__all__'


class PeopleSerializer(serializers.ModelSerializer):
	class Meta:
		model = People
		fields = '__all__'


class ResultsSerializer(serializers.ModelSerializer):
	name_1 = PeopleSerializer()
	name_2 = PeopleSerializer()
	rater = PeopleSerializer()

	class Meta:
		model = Results
		fields = '__all__'



class Results_ClosenessSerializer(serializers.ModelSerializer):
	name = PeopleSerializer()
	rater = PeopleSerializer()

	class Meta:
		model = Results_Closeness
		fields = '__all__'
