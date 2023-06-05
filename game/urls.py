from django.urls import path, include, reverse

from game.views import IndexView, CountryListView

urlpatterns = [
    path('', IndexView.as_view()),
    path('api/', include('api.urls')),
    path('country_list', CountryListView.as_view(), name='country_list'),
]
