from django.urls import path, include, reverse

from game.views import IndexView

urlpatterns = [
    path('', IndexView.as_view()),
    path('api/', include('api.urls')),
]
