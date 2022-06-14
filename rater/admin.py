from django.contrib import admin
from .models import Final_Results, Experiment, Results, People

admin.site.register(People)
admin.site.register(Experiment)
admin.site.register(Final_Results)


class ResultsAdmin(admin.ModelAdmin):
	readonly_fields = ('uuid',)

admin.site.register(Results, ResultsAdmin)
