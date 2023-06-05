from django.urls import path

from rest_framework import routers

from api.v1.game.views import CountryViewSet, CountryExistsView, GameStateView

router = routers.DefaultRouter()
router.register('country', CountryViewSet)

urlpatterns = [
    path('state/', GameStateView.as_view(), name='Game state info'),
    path('country/check/', CountryExistsView.as_view(), name='Check if country exists'),
]

urlpatterns += router.urls
