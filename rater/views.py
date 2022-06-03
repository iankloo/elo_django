from rest_framework import generics, permissions
from .serializers import ExperimentSerializer, ResultsSerializer, PeopleSerializer, Results_ClosenessSerializer, ExperimentClosenessSerializer, NewUserSerializer
from .models import Experiment, Results, People, Comments, Results_Closeness, Experiment_Closeness, Comments_Constructive
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime
from django.utils import timezone
from itertools import chain
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView

class UserAPIView(RetrieveAPIView):
	permission_classes = (IsAuthenticated,)
	serializer_class = NewUserSerializer

	def get_object(self):
		return self.request.user


class add_exp_internal(APIView):
	permission_classes = (IsAuthenticated,)

	def post(self, request, version):

		title = request.data['title']
		creator = request.data['creator']
		names = request.data.getlist('names[]') #this is weird, but how you have to retrieve the list from AJAX
		question = request.data['question']
		comment_type = 'Standard'

		if title == '' or creator == '' or names == '' or question == '':
			return Response(status = 201)
		else:
			people = People.objects.filter(pk__in = names)

			ex = Experiment()
			ex.title = title
			ex.creator = creator
			ex.question = question
			ex.comment_type = comment_type
			ex.save()
			for p in people:
				ex.names.add(p)
			ex.save()

			return Response(status = 200)


#restrict permissions later
#@permission_classes((permissions.AllowAny,))
class delete_people_internal(APIView):
	permission_classes = (IsAuthenticated,)
	def post(self, request, version):
		People.objects.get(id = request.data['id']).delete()

		return Response(status = 200)

class delete_exp_internal(APIView):
	permission_classes = (IsAuthenticated,)
	def post(self, request, version):
		Experiment.objects.get(id = request.data['id']).delete()

		return Response(status = 200)


#restrict permissions later
#@permission_classes((permissions.AllowAny,))
class add_people_internal(APIView):
	permission_classes = (IsAuthenticated,)

	def post(self, request, version):
		#this signifies an edit
		if request.data['id'] != '':
			first = request.data['first']
			if(request.data['middle']):
				middle = request.data['middle']
			else:
				middle = ''
			last = request.data['last']
			rank = request.data['rank']
			email = request.data['email']
			id = request.data['id']

			if first == '' or last == '' or email == '':
				return Response(status = 201)
			else:
				p = People.objects.get(id = id)
				p.first = first
				p.middle = middle
				p.last = last
				p.rank = rank
				p.email = email

				p.save()

				return Response(status = 200)
		#this creates a new user
		else:
			first = request.data['first']
			if(request.data['middle']):
				middle = request.data['middle']
			else:
				middle = ''
			last = request.data['last']
			rank = request.data['rank']
			email = request.data['email']

			if first == '' or last == '' or email == '':
				return Response(status = 201)
			else:
				p = People()
				p.first = first
				p.middle = middle
				p.last = last
				p.rank = rank
				p.email = email

				p.save()

				return Response(status = 200)

#restrict permissions later
class PeopleInternalView(generics.ListAPIView):
	permission_classes = (IsAuthenticated,)
	serializer_class = PeopleSerializer

	def get_queryset(self):
		queryset = People.objects.all()

		return queryset

class ExperimentInternalView(generics.ListAPIView):
	permission_classes = (IsAuthenticated,)
	serializer_class = ExperimentSerializer

	def get_queryset(self):
		queryset = Experiment.objects.all()

		return queryset

class UserCodeView(generics.ListAPIView):
	permission_classes = (IsAuthenticated,)

	def post(self, request, version):
		exp_id = request.data['exp_id']

		exp = Experiment.objects.get(pk = exp_id)
		res = Results.objects.filter(experiment_name = exp)
		users_and_ids = res.values_list( 'rater__rank', 'rater__first', 'rater__last', 'rater__email','uuid').distinct()

		return Response(users_and_ids, status = 200)


class ExperimentView(generics.ListAPIView):
	serializer_class = ExperimentSerializer

	def get_queryset(self):
		queryset = Experiment.objects.all()
		exp_id = self.request.query_params.get('exp_id', None)

		if exp_id is not None:
			queryset = queryset.filter(pk = exp_id)

		return queryset


class ExperimentExternalView(generics.ListAPIView):
	permission_classes = (IsAuthenticated,)

	serializer_class = ExperimentSerializer

	def get_queryset(self):
		queryset = Experiment.objects.all()

		return queryset


class ExperimentClosenessExternalView(generics.ListAPIView):
	permission_classes = (IsAuthenticated,)

	serializer_class = ExperimentClosenessSerializer

	def get_queryset(self):
		queryset = Experiment_Closeness.objects.all()

		return queryset


class PeopleExternalView(generics.ListAPIView):
	permission_classes = (IsAuthenticated,)

	serializer_class = PeopleSerializer

	def get_queryset(self):
		queryset = People.objects.all()

		return queryset


class ResultsExternalView(generics.ListAPIView):
	permission_classes = (IsAuthenticated,)

	serializer_class = ResultsSerializer

	def get_queryset(self):
		queryset = Results.objects.all()

		exp_id = self.request.query_params.get('exp_id', None)

		if exp_id is not None:
			queryset = queryset.filter(experiment_name = exp_id)

		return queryset

class ResultsView(generics.ListAPIView):
	serializer_class = ResultsSerializer

	def get_queryset(self):
		queryset = Results.objects.all()

		unique_id = self.request.query_params.get('uuid', None)

		if unique_id is not None:
			queryset = queryset.filter(uuid = unique_id, winner__isnull = True)


		return queryset


class Results_ClosenessView(generics.ListAPIView):
	serializer_class = Results_ClosenessSerializer

	def get_queryset(self):
		queryset = Results_Closeness.objects.all()

		unique_id = self.request.query_params.get('uuid', None)

		if unique_id is not None:
			queryset = queryset.filter(uuid = unique_id, closeness__isnull = True)

		return queryset

class Results_ClosenessExternalView(generics.ListAPIView):
	permission_classes = (IsAuthenticated,)

	serializer_class = Results_ClosenessSerializer

	def get_queryset(self):
		queryset = Results_Closeness.objects.all()

		exp_id = self.request.query_params.get('exp_id', None)

		if exp_id is not None:
			queryset = queryset.filter(experiment_name = exp_id)

		return queryset


class CommentView(generics.ListAPIView):
	serializer_class = PeopleSerializer

	def get_queryset(self):
		unique_id = self.request.query_params.get('uuid', None)

		queryset = Results.objects.filter(uuid = unique_id)
		rater = queryset[0].rater
		sub = queryset[0].experiment_name

		n1 = queryset.values_list('name_1',flat = True).distinct()
		n2 = queryset.values_list('name_2',flat = True).distinct()

		test = set(chain(n1, n2))
		again = People.objects.filter(pk__in = test)

		already_commented = Comments.objects.filter(experiment_name = sub, rater_name = rater)
		a_c_people = already_commented.values_list('subject_name')

		final = again.exclude(pk__in = a_c_people)

		return final


class CommentTypeView(generics.ListAPIView):
	serializer_class = ExperimentSerializer

	def get_queryset(self):
		unique_id = self.request.query_params.get('uuid', None)

		result = Results.objects.filter(uuid = unique_id)

		queryset = Experiment.objects.filter(pk = result[0].experiment_name.pk)


		return queryset




@permission_classes((permissions.AllowAny,))
class add_results(APIView):
	def post(self, request, version):

		id = request.POST['id']

		t = Results.objects.get(pk = id)
		t.winner = People.objects.get(pk = request.POST['winner'])
		t.date = datetime.now()

		start = request.POST['start_time']
		t.start = int(start)

		end = request.POST['end_time']
		t.end = int(end)

		t.save()

		return Response(status = 200)

@permission_classes((permissions.AllowAny,))
class add_closeness_results(APIView):
	def post(self, request, version):
		print(request.POST)

		id = request.POST['id']

		t = Results_Closeness.objects.get(pk = id)
		t.name = People.objects.get(pk = request.POST['name'])
		t.closeness = request.POST['closeness']
		t.date = datetime.now()

		start = request.POST['start_time']
		t.start = int(start)

		end = request.POST['end_time']
		t.end = int(end)

		t.save()

		return Response(status = 200)

class add_people_external(APIView):
	permission_classes = (IsAuthenticated,)

	def post(self, request, version):

		first = request.data['first']
		if(request.data['middle']):
			middle = request.data['middle']
		else:
			middle = ''
		last = request.data['last']
		rank = request.data['rank']
		email = request.data['email']

		p = People()
		p.first = first
		p.middle = middle
		p.last = last
		p.rank = rank
		p.email = email

		p.save()

		return Response(status = 200)


class add_exp_external(APIView):
	permission_classes = (IsAuthenticated,)

	def post(self, request, version):

		title = request.data['title']
		creator = request.data['creator']
		names = request.data['name_ids']
		question = request.data['question']
		comment_type = request.data['comment_type']

		people = People.objects.filter(pk__in = names)

		ex = Experiment()
		ex.title = title
		ex.creator = creator
		ex.question = question
		ex.comment_type = comment_type

		ex.save()

		for p in people:
			ex.names.add(p)



		ex.save()

		return Response(status = 200)


class add_closeness_exp_external(APIView):
	permission_classes = (IsAuthenticated,)

	def post(self, request, version):

		title = request.data['title']
		creator = request.data['creator']
		names = request.data['name_ids']

		people = People.objects.filter(pk__in = names)

		ex = Experiment_Closeness()
		ex.title = title
		ex.creator = creator

		ex.save()

		for p in people:
			ex.names.add(p)

		ex.save()

		return Response(status = 200)




@permission_classes((permissions.AllowAny,))
class add_comments(APIView):
	def post(self, request, version):

		uuid = request.POST['uuid']
		#rater_id = request.POST['rater_id']
		subject_id = request.POST['subject_id']
		comment = request.POST['comment']

		r = Results.objects.filter(uuid = uuid)

		#print(r[0].rater)

		#p = People.objects.get(pk = r[0].rater)
		e = r[0].experiment_name
		rater = r[0].rater

		subject = People.objects.get(pk = subject_id)

		com = Comments()
		com.experiment_name = e
		com.rater_name = rater
		com.subject_name = subject
		com.comment = comment

		#print(com)
		com.save()

		return Response(status = 200)


@permission_classes((permissions.AllowAny,))
class add_virtue_comments(APIView):
	def post(self, request, version):

		uuid = request.POST['uuid']
		#rater_id = request.POST['rater_id']
		subject_id = request.POST['subject_id']
		comment = request.POST['comment']
		comment_2 = request.POST['comment_2']
		does = request.POST['does']
		virtue = request.POST['virtue']

		r = Results.objects.filter(uuid = uuid)

		#print(r[0].rater)

		#p = People.objects.get(pk = r[0].rater)
		e = r[0].experiment_name
		rater = r[0].rater

		subject = People.objects.get(pk = subject_id)

		com = Comments()
		com.experiment_name = e
		com.rater_name = rater
		com.subject_name = subject
		com.comment = comment
		com.does = does
		com.virtue = virtue
		#print(com)
		com.save()

		const_com = Comments_Constructive()
		const_com.experiment_name = e
		const_com.rater_name = rater
		const_com.subject_name = subject
		const_com.comment = comment_2

		const_com.save()

		return Response(status = 200)
