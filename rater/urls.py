from django.urls import include, path
from .views import Results_ClosenessExternalView, ExperimentClosenessExternalView, add_closeness_exp_external, add_closeness_results, Results_ClosenessView, ExperimentView, ExperimentExternalView, ResultsView, PeopleExternalView, add_exp_external, ResultsExternalView, CommentTypeView, add_results, add_comments, CommentView, add_virtue_comments, add_people_external


urlpatterns = [
    path('exp/', ExperimentView.as_view(), name="exp-all"),
    path('exp_external/', ExperimentExternalView.as_view(), name="exp-external-all"),
    path('exp_external_closeness/', ExperimentClosenessExternalView.as_view(), name="exp-external-closeness-all"),
    path('res/', ResultsView.as_view(), name="res-all"),
    path('res_closeness/', Results_ClosenessView.as_view(), name="res-closeness-all"),
    path('res_external/', ResultsExternalView.as_view(), name="res-external-all"),
    path('res_external_closeness/', Results_ClosenessExternalView.as_view(), name="res-external-closeness-all"),
    path('people_external/', PeopleExternalView.as_view(), name="people-external-all"),
    path('add_rating/', add_results.as_view(), name = 'add_results'),
    path('add_closeness_rating/', add_closeness_results.as_view(), name = 'add_closeness_results'),
    path('add_comment/', add_comments.as_view(), name = 'add_comments'),
	path('comments/', CommentView.as_view(), name="comments"),
	path('comment_type/', CommentTypeView.as_view(), name="comment_type"),
    path('add_virtue_comments/', add_virtue_comments.as_view(), name = 'add_virtue_comments'),
    path('add_people_external/', add_people_external.as_view(), name = 'add_people_external'),
    path('add_exp_external/', add_exp_external.as_view(), name = 'add_exp_external'),
    path('add_closeness_exp_external/', add_closeness_exp_external.as_view(), name = 'add_closeness_exp_external'),
]
