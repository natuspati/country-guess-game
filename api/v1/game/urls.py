from django.urls import path

from rest_framework import routers

from api.v1.game.views import CountryViewSet, UserStatsView

router = routers.DefaultRouter()
router.register('country', CountryViewSet)

urlpatterns = [
    path('stats/', UserStatsView.as_view(), name='User stats view'),
]

urlpatterns += router.urls
