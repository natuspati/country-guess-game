from datetime import datetime
from importlib import import_module

import django.core.exceptions
from django.contrib.sessions.models import Session
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie, vary_on_headers

from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import GenericAPIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED

from game.models import Country, UserStats
from api.v1.permissions import IsAdminOrReadOnly
from api.v1.game.serializers import CountrySerializer, CountryDetailSerializer, UserStatsSerializer
from api.v1.game.utils import select_random_country
from api.v1.game.exceptions import NoCurrentDateCookieException

SessionStore = import_module(settings.SESSION_ENGINE).SessionStore


class CountryViewSet(ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    lookup_field = 'slug'
    search_fields = ['^name']
    filterset_fields = ['region']
    ordering_fields = ['name', 'population']
    
    def get_serializer_class(self):
        if self.action in ['retrieve', 'put', 'patch', 'delete']:
            return CountryDetailSerializer
        return super().get_serializer_class()
    
    @method_decorator(cache_page(60 * 60 * 24 * 14))  # 2 weeks
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @method_decorator(cache_page(60 * 60 * 24 * 14))  # 2 weeks
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    @method_decorator(cache_page(60 * 60))  # 1 hour
    @method_decorator(vary_on_cookie)
    @action(methods=['get'], detail=False, name='Country of the day')
    def today(self, request):
        current_date = request.COOKIES.get('current_date')
        # If current date is not set in cookies or badly formatted, select a random country.
        try:
            if current_date:
                country_today = self.get_queryset().get(used_at=current_date)
            else:
                raise NoCurrentDateCookieException
        except (django.core.exceptions.ValidationError, NoCurrentDateCookieException, Country.DoesNotExist):
            country_today = select_random_country()
        
        country_serializer = CountrySerializer(country_today, context={'request': request})
        
        return Response(country_serializer.data, status=HTTP_200_OK)


class UserStatsView(GenericAPIView):
    serializer_class = UserStatsSerializer
    queryset = UserStats.objects.all()
    allowed_methods = ['GET', 'PUT']
    
    def get(self, request, *args, **kwargs):
        current_session_id = self.get_current_session_id()
        
        user_stats, created = self.get_queryset().get_or_create(
            session_id=current_session_id
        )
        
        # Try to obtain current date in user's timezone ...
        if not created:
            # using query parameters
            if self.request.query_params.get('current_date'):
                current_date = self.request.query_params.get('current_date')
            # using cookies
            elif 'current_date' in self.request.COOKIES:
                current_date = self.request.COOKIES['current_date']
            # Set the server time if query parameters and cookies fail
            else:
                current_date = datetime.today()
            
            if type(current_date) is str:
                current_date = datetime.strptime(current_date, '%Y-%m-%d').date()
            
            # Reset the game state if the current date s different from the last played date
            if user_stats.last_played != current_date:
                user_stats.last_game_state = settings.DEFAULT_GAME_STATE_OPTION
                user_stats.last_number_tries = settings.NUMBER_TRIES
                user_stats.save()
        
        game_state_serializer = self.get_serializer(user_stats)
        return Response(game_state_serializer.data)
    
    def put(self, request, *args, **kwargs):
        current_session_id = self.get_current_session_id()
        user_stats_serializer = self.get_serializer(data=request.data)
        
        if user_stats_serializer.is_valid():
            validated_user_stats = user_stats_serializer.data
            
            user_stats, created = self.get_queryset().update_or_create(
                session_id=current_session_id,
                defaults=validated_user_stats
            )
            
            if created:
                return Response(data=validated_user_stats, status=HTTP_201_CREATED)
            else:
                return Response(data=validated_user_stats, status=HTTP_200_OK)
        
        else:
            return Response(data='Game state data is invalid.', status=HTTP_400_BAD_REQUEST)
    
    def get_current_session_id(self):
        if self.request.session.get('anon_id') is None:
            new_session = SessionStore()
            new_session.create()
            new_session['anon_id'] = new_session.session_key
            self.request.session['anon_id'] = new_session.session_key
            return new_session.session_key
        else:
            return self.request.session.get('anon_id')
