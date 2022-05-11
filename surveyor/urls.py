from django.urls import include, path
from .views import Survey_Results_View, add_post_results


urlpatterns = [
    path('survey/', Survey_Results_View.as_view(), name="survey-all"),
    path('add_post_results/', add_post_results.as_view(), name = 'add_post_results'),
]