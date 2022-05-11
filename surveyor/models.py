from django.db import models


class Survey_Results(models.Model):
	question = models.CharField(max_length = 500)
	response = models.CharField(max_length = 4000)
	date = models.DateField(auto_now_add=True)
	uuid = models.CharField(max_length = 60)

	def __str__(self):
		return self.uuid + "'s response " + str(self.date)

	class Meta:
		verbose_name_plural = "Survey_Results"
