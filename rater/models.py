from django.db import models, transaction
import uuid
from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver
import itertools



c_types = (
	('Standard', 'Standard'),
	('Virtues', 'Virtues'),
	('None', 'None')
)

class Experiment(models.Model):
	title = models.CharField(max_length = 200, unique = True)
	creator = models.CharField(max_length = 60)
	date = models.DateField(auto_now_add=True)
	completed = models.BinaryField()
	names = models.ManyToManyField(
		to = 'rater.People'
	)
	question = models.CharField(max_length = 200)
	comment_type = models.CharField(choices = c_types, max_length = 30, default = 'Standard')
	per_complete = models.CharField(blank = True, null = True, default = 0, max_length = 30)

	def __str__(self):
		return self.title + " - " + str(self.date)

ranks = (
	('PVT','PVT'),
	('PV2','PV2'),
	('PFC','PFC'),
	('SPC','SPC'),
	('CPL','CPL'),
	('SGT','SGT'),
	('SSG','SSG'),
	('SFT','SFT'),
	('MSG','MSG'),
	('1SG','1SG'),
	('SGM','SGM'),
	('Cadet','Cadet'),
	('2LT', '2LT'),
	('1LT', '1LT'),
	('CPT', 'CPT'),
	('MAJ', 'MAJ'),
	('LTC', 'LTC'),
	('COL', 'COL'),
	('BG', 'BG'),
	('MG', 'MG'),
	('LTG', 'LTG'),
	('CIV', 'CIV')
)

class People(models.Model):
	first = models.CharField(max_length = 60)
	middle = models.CharField(max_length = 60, null = True, blank = True, default = '')
	last = models.CharField(max_length = 60)
	rank = models.CharField(choices = ranks, max_length = 5)
	email = models.CharField(max_length = 60, null = True, blank = True, unique = True)

	def __str__(self):
		if(self.rank == 'CIV'):
			return self.first + " " + self.last
		else:
			return self.rank + " " + self.first + " " + self.last


	class Meta:
		verbose_name_plural = "people"
		unique_together = ['first','middle','last','rank','email']



class Final_Results(models.Model):
	experiment_name = models.ForeignKey(Experiment, on_delete = models.CASCADE)
	names = models.ForeignKey(People, on_delete = models.CASCADE)
	score = models.DecimalField(max_digits = 30, decimal_places = 5)

	def __str__(self):
		return str(self.experiment_name) + ": " + str(self.names)





class Results(models.Model):
	name_1 = models.ForeignKey(People, on_delete = models.CASCADE, related_name='name_1')
	name_2 = models.ForeignKey(People, on_delete = models.CASCADE, related_name='name_2')
	winner = models.ForeignKey(People, on_delete = models.CASCADE, related_name='winner', null = True, blank = True)
	rater = models.ForeignKey(People, on_delete = models.CASCADE, related_name='rater')
	experiment_name = models.ForeignKey(Experiment, on_delete = models.CASCADE)
	date = models.DateField(blank = True, null = True)
	uuid = models.UUIDField(blank = True, null = True, editable = False)
	#keep these as numbers since js passes milliseconds - pythons field won't keep it
	start = models.BigIntegerField(blank = True, null = True)
	end = models.BigIntegerField(blank = True, null = True)

	def __str__(self):
		if(self.winner):
			return str(self.rater) + ": " + str(self.name_1) + " vs " + str(self.name_2) + " | COMPLETE"
		else:
			return str(self.rater) + ": " + str(self.name_1) + " vs " + str(self.name_2)

	class Meta:
		verbose_name_plural = "results"


#when experiment is added, create pairwise comparisons and wntries to Results table

#this one works from admin, but not from API
#@receiver(m2m_changed, sender = Experiment.names.through)



#this one works from API, but not admin
@receiver(post_save, sender = Experiment)
def build_pairwise_shell(sender, **kwargs):

	instance = kwargs.pop('instance', None)
	exp = Experiment.objects.get(pk = instance.pk)

	n = exp.names.all()
	#my_names = [(str(my_record.first + " " + my_record.last)) for my_record in n]

	#my_names = n.values('names')
	#print(n)

	pairs = list(itertools.combinations(n, 2))

	if(pairs != []):
		for name in n:
			#filter to everyone that isn't you
			test = [p for p in pairs if name not in p]
			my_uuid = uuid.uuid4()

			#add each pairwise rating
			for t in test:
				obj = Results()
				obj.name_1 = t[0]
				obj.name_2 = t[1]
				obj.rater = name
				obj.experiment_name = instance
				obj.uuid = my_uuid

				print(type(t[0]))
				obj.save()

	#pk_set = kwargs.pop('pk_set', None)
	#action = kwargs.pop('action', None)
	#print(pk_set)

	#print(action)

	#if action == "post_add":
	#	exp = Experiment.objects.get(pk = instance.pk)

	#	n = exp.names.all()
		#my_names = [(str(my_record.first + " " + my_record.last)) for my_record in n]

		#my_names = n.values('names')
		#print(n)

	#	pairs = list(itertools.combinations(n, 2))
	#	print(pairs)

	#	for name in n:
			#filter to everyone that isn't you
	#		test = [p for p in pairs if name not in p]
	#		my_uuid = uuid.uuid4()

			#add each pairwise rating
	#		for t in test:
	#			obj = Results()
	#			obj.name_1 = t[0]
	#			obj.name_2 = t[1]
	#			obj.rater = name
	#			obj.experiment_name = instance
	#			obj.uuid = my_uuid

				#print(type(t[0]))
	#			obj.save()



class Comments(models.Model):
	experiment_name = models.ForeignKey(Experiment, on_delete = models.CASCADE)
	rater_name = models.ForeignKey(People, on_delete = models.CASCADE, related_name='rater_name')
	subject_name = models.ForeignKey(People, on_delete = models.CASCADE, related_name='subject_name')
	comment = models.TextField(max_length = 500)
	does = models.TextField(max_length = 10, null = True, blank = True)
	virtue = models.TextField(max_length = 500, null = True, blank = True)

	class Meta:
			verbose_name_plural = "comments"

class Comments_Constructive(models.Model):
	experiment_name = models.ForeignKey(Experiment, on_delete = models.CASCADE)
	rater_name = models.ForeignKey(People, on_delete = models.CASCADE, related_name='rater_name_const')
	subject_name = models.ForeignKey(People, on_delete = models.CASCADE, related_name='subject_name_const')
	comment = models.TextField(max_length = 500)

	class Meta:
			verbose_name_plural = "comments_constructive"



class Experiment_Closeness(models.Model):
	title = models.CharField(max_length = 60)
	creator = models.CharField(max_length = 60)
	date = models.DateField(auto_now_add=True)
	completed = models.BinaryField()
	names = models.ManyToManyField(
		to = 'rater.People'
	)

	def __str__(self):
		return self.title + " - " + str(self.date)


class Results_Closeness(models.Model):
	rater = models.ForeignKey(People, on_delete = models.CASCADE, related_name='rater_closeness')
	name = models.ForeignKey(People, on_delete = models.CASCADE, related_name='name_closeness')
	closeness = models.TextField(max_length = 10, null = True, blank = True)
	experiment_name = models.ForeignKey(Experiment_Closeness, on_delete = models.CASCADE)
	date = models.DateField(blank = True, null = True)
	uuid = models.UUIDField(blank = True, null = True, editable = False)
	#keep these as numbers since js passes milliseconds - pythons field won't keep it
	start = models.BigIntegerField(blank = True, null = True)
	end = models.BigIntegerField(blank = True, null = True)

	def __str__(self):
		if(self.closeness):
			return str(self.rater) + ": " + str(self.name) + " | COMPLETE"
		else:
			return str(self.rater) + ": " + str(self.name)

	class Meta:
		verbose_name_plural = "results_closeness"


# @receiver(m2m_changed, sender = Experiment_Closeness.names.through)
# def build_pairwise_shell(sender, **kwargs):
# 	instance = kwargs.pop('instance', None)
# 	exp = Experiment_Closeness.objects.get(pk = instance.pk)
# 	pk_set = kwargs.pop('pk_set', None)
# 	action = kwargs.pop('action', None)

# 	if action == "post_add":
# 		exp = Experiment_Closeness.objects.get(pk = instance.pk)

# 		n = exp.names.all()
# 		names = list(n)


# 		for i, name in enumerate(names):

# 			test = names[:i]+names[i+1:]

# 			my_uuid = uuid.uuid4()

# 			#add each pairwise rating
# 			for t in test:
# 				obj = Results_Closeness()
# 				obj.name = t
# 				obj.rater = name
# 				obj.experiment_name = instance
# 				obj.uuid = my_uuid

# 				#print(type(t[0]))
# 				obj.save()




@receiver(post_save, sender = Experiment_Closeness)
def build_pairwise_shell_closeness(sender, **kwargs):

	instance = kwargs.pop('instance', None)
	exp = Experiment_Closeness.objects.get(pk = instance.pk)
	pk_set = kwargs.pop('pk_set', None)
	action = kwargs.pop('action', None)

	exp = Experiment_Closeness.objects.get(pk = instance.pk)

	n = exp.names.all()
	names = list(n)


	for i, name in enumerate(names):

		test = names[:i]+names[i+1:]

		my_uuid = uuid.uuid4()

		#add each pairwise rating
		for t in test:
			obj = Results_Closeness()
			obj.name = t
			obj.rater = name
			obj.experiment_name = instance
			obj.uuid = my_uuid

			#print(type(t[0]))
			obj.save()
