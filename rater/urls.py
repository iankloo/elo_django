from django.urls import include, path
from .views import get_final_results, get_progress_byuser_internal, get_progress_internal, UserCodeView, ExperimentInternalView, ExperimentView, ExperimentExternalView, ResultsView, PeopleExternalView, PeopleInternalView, add_exp_external, add_exp_internal, ResultsExternalView, add_results, add_people_external, add_people_internal, delete_people_internal, delete_exp_internal


urlpatterns = [
    path('exp/', ExperimentView.as_view(), name="exp-all"),
    path('exp_external/', ExperimentExternalView.as_view(), name="exp-external-all"),
    path('exp_internal/', ExperimentInternalView.as_view(), name="exp-internal-all"),
    path('res/', ResultsView.as_view(), name="res-all"),
    path('res_external/', ResultsExternalView.as_view(), name="res-external-all"),
    path('people_external/', PeopleExternalView.as_view(), name="people-external-all"),
    path('people_internal/', PeopleInternalView.as_view(), name="people-internal-all"),
    path('add_rating/', add_results.as_view(), name = 'add_results'),
    #path('add_comment/', add_comments.as_view(), name = 'add_comments'),
	#path('comments/', CommentView.as_view(), name="comments"),
    path('add_people_external/', add_people_external.as_view(), name = 'add_people_external'),
    path('add_people_internal/', add_people_internal.as_view(), name = 'add_people_internal'),
    path('delete_people_internal/', delete_people_internal.as_view(), name = 'delete_people_internal'),
    path('add_exp_external/', add_exp_external.as_view(), name = 'add_exp_external'),
    path('add_exp_internal/', add_exp_internal.as_view(), name = 'add_exp_internal'),
    path('delete_exp_internal/', delete_exp_internal.as_view(), name = 'delete_exp_internal'),
    path('user_code_view/', UserCodeView.as_view(), name = 'user_code_view'),
    path('get_progress_internal/', get_progress_internal.as_view(), name = 'get_progress_internal'),
    path('get_progress_byuser_internal/', get_progress_byuser_internal.as_view(), name = 'get_progress_byuser_internal'),
    path('get_final_results/', get_final_results.as_view(), name = 'get_final_results'),
]
