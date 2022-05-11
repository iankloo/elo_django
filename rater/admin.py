from django.contrib import admin
from .models import Experiment, Results, People, Comments, Experiment_Closeness, Results_Closeness, Comments_Constructive

admin.site.register(People)
admin.site.register(Experiment)
admin.site.register(Comments)
admin.site.register(Comments_Constructive)

class ResultsAdmin(admin.ModelAdmin):
	readonly_fields = ('uuid',)

admin.site.register(Results, ResultsAdmin)
admin.site.register(Experiment_Closeness)

class Results_ClosenessAdmin(admin.ModelAdmin):
	readonly_fields = ('uuid',)

admin.site.register(Results_Closeness, Results_ClosenessAdmin)