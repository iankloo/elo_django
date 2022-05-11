from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Survey_Results
from .serializers import Survey_Results_Serializer
import re

class Survey_Results_View(generics.ListAPIView):
	serializer_class = Survey_Results_Serializer

	def get_queryset(self):
		queryset = Survey_Results.objects.all()

		return queryset


@permission_classes((permissions.AllowAny,))
class add_post_results(APIView):
	def post(self, request, version):

		l = list(request.POST.keys())

		r = re.compile("q")
		qs = list(filter(r.match, l))

		print(qs)

		index = 1
		for q in qs:
			s = Survey_Results()
			s.question = request.POST[q]
			s.response = request.POST['r'+str(index)]
			s.uuid = request.POST['uuid']

			s.save()

			index += 1

		return Response(status = 200)