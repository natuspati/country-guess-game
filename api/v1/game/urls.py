from django.urls import path

from rest_framework import routers

from api.v1.game.views import CountryViewSet, GameStateView

router = routers.DefaultRouter()
router.register('country', CountryViewSet)

urlpatterns = [
    path('state/', GameStateView.as_view(), name='Game state info'),
]

urlpatterns += router.urls
