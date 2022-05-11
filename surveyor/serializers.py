from rest_framework import serializers
from .models import Survey_Results

class Survey_Results_Serializer(serializers.ModelSerializer):
	class Meta:
		model = Survey_Results
		fields = '__all__'

