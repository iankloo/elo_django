from rest_framework import generics, permissions
from .serializers import Final_ResultsSerializer, ExperimentSerializer, ResultsSerializer, PeopleSerializer, NewUserSerializer
from .models import Experiment, Results, People, Final_Results
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime
from django.utils import timezone
from itertools import chain
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView
from django.db.models import CharField, Value, Count
import pandas as pd
import itertools
from django.http import HttpResponse, JsonResponse

def get_elo_scores(exp_id, num_runs = 500):
    
    def elo_match(ra, rb, winner = 'a', k = 32):
        exp_a = 1 / (1 + (10 ** ((rb - ra) / 400)))
        exp_b = 1 / (1 + (10 ** ((ra - rb) / 400)))
        if winner == 'a':
            fa = ra + (k * (1 - exp_a))
            fb = rb + (k * (0 - exp_b))
        else:
            fa = ra + (k * (0 - exp_a))
            fb = rb + (k * (1 - exp_b))

        return [fa, fb]
    
    my_exp = Experiment.objects.get(id = exp_id)
    my_res = Results.objects.filter(experiment_name = my_exp.id)
    df = pd.DataFrame.from_records(my_res.values('name_1', 'name_2','winner', 'rater'))
    df['loser'] = df.name_1
    df.loser[df.loser == df.winner] = df.name_2
    df.drop(['name_1', 'name_2'], axis = 1, inplace = True)
    
    all_runs = list()
    for i in range(num_runs):
        #shuffle data
        df = df.sample(frac = 1)
        #starting scores
        running_scores = {x: 1000 for x in set(pd.concat([df['winner'], df['loser']]))}
        #set scores based on wins/losses
        for index, row in df.iterrows():
            elo_update = elo_match(running_scores[row.winner], running_scores[row.loser])
            running_scores[row.winner] = elo_update[0]
            running_scores[row.loser] = elo_update[1]

        all_runs.append(pd.DataFrame(running_scores.items(), columns = ['name','score']))

    all_runs = pd.concat(all_runs, ignore_index = True)
    avg_scores = all_runs.groupby('name').mean()
    avg_scores.reset_index(drop = False, inplace = True)
    
    return(avg_scores)



class UserAPIView(RetrieveAPIView):
	permission_classes = (IsAuthenticated,)
	serializer_class = NewUserSerializer

	def get_object(self):
		return self.request.user



class get_final_results(APIView):
	permission_classes = (IsAuthenticated,)

	def post(self, request, version):
		my_id = request.data.getlist('id')
		res_exists = Final_Results.objects.filter(experiment_name = my_id[0])

		#if results not calculated yet, calculate them
		if len(res_exists) == 0:
			output = get_elo_scores(exp_id = my_id[0], num_runs = 1000)
			exp = Experiment.objects.get(id = my_id[0])
			for index, row in output.iterrows():
				fin_res = Final_Results()
				fin_res.experiment_name = exp
				fin_res.names = People.objects.get(pk = row['name'])
				fin_res.score = row.score

				fin_res.save()

			res_exists = Final_Results.objects.filter(experiment_name = my_id[0])
			out = Final_ResultsSerializer(res_exists.order_by('-score'), many = True)
			return JsonResponse(out.data, status = 201, safe = False)


		else:
			out = Final_ResultsSerializer(res_exists.order_by('-score'), many = True)
			return JsonResponse(out.data, status = 201, safe = False)


		


#build this progress checking view...
class get_progress_internal(APIView):
	permission_classes = (IsAuthenticated,)

	def post(self, request, version):

		ids = request.data.getlist('ids[]')
		pers = []
		for i in ids:	
			my_res = Results.objects.filter(experiment_name = i)
			per = round((my_res.filter(winner__isnull = False).count() / len(my_res)) * 100, 2)
			pers.append(per)

		return Response(pers, status = 200)


class get_progress_byuser_internal(APIView):
	permission_classes = (IsAuthenticated,)

	def post(self, request, version):

		id = request.data['u_id']

		my_res = Results.objects.filter(experiment_name = id)
		raters_names = list(my_res.values_list('rater', 'rater__first', 'rater__last').distinct())

		pers = []
		for r in raters_names:
			rater_sub = my_res.filter(rater = r[0])
			per = round((rater_sub.filter(winner__isnull = False).count() / len(rater_sub)) * 100, 2)
			pers.append({'first': r[1], 'last': r[2], 'per': per})

		return Response(pers, status = 200)



class add_exp_internal(APIView):
	permission_classes = (IsAuthenticated,)

	def post(self, request, version):

		title = request.data['title']
		creator = request.data['creator']
		names = request.data.getlist('names[]') #this is weird, but how you have to retrieve the list from AJAX
		question = request.data['question']
		rate_self = request.data['rate_self'] #returns 'true' or 'false'
		if rate_self == 'true':
			rate_self = True
		else:
			rate_self = False

		make_comments = request.data['make_comments']
		if make_comments == 'true':
			make_comments = True
		else:
			make_comments = False

		comments_at_end = request.data['comments_at_beginning']
		if comments_at_end == 'true':
			comments_at_end = False
		else:
			comments_at_end = True

		comments_required = request.data['require_comments']
		if comments_required == 'true':
			comments_required = True
		else:
			comments_required = False


		if title == '' or creator == '' or names == '' or question == '':
			return Response(status = 201)
		elif len(names) < 3:
			return Response(status = 202)
		else:
			people = People.objects.filter(pk__in = names)

			ex = Experiment()
			ex.title = title
			ex.creator = creator
			ex.question = question
			ex.rate_self = rate_self
			if make_comments == True:
				ex.make_comments = make_comments
				ex.comments_at_end = comments_at_end
				ex.comments_required = comments_required
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

		check_exp = Experiment.objects.filter(names = request.data['id'])
		if len(check_exp) == 0:
			People.objects.get(id = request.data['id']).delete()
			return Response(status = 200)

		else:
			return Response(status = 201)

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

		people = People.objects.filter(pk__in = names)

		ex = Experiment()
		ex.title = title
		ex.creator = creator
		ex.question = question

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

		#p = People.objects.get(pk = r[0].rater)
		e = r[0].experiment_name
		rater = r[0].rater

		subject = People.objects.get(pk = subject_id)

		com = Comments()
		com.experiment_name = e
		com.rater_name = rater
		com.subject_name = subject
		com.comment = comment

		com.save()

		return Response(status = 200)

