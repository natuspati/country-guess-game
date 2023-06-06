import django.core.exceptions
from django.conf import settings

from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import GenericAPIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST

from game.models import Country
from api.v1.game.serializers import CountrySerializer, CountryExistsSerializer, GameSateSerializer
from api.v1.game.utils import select_random_country
from api.v1.game.exceptions import NoCurrentDateCookieException


class CountryViewSet(ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    lookup_field = 'slug'
    filterset_fields = ['name', 'region']
    ordering_fields = ['name', 'population']
    
    @action(methods=['get'], detail=False, name='Country of the day')
    def today(self, request):
        current_date = request.COOKIES.get('current_date')
        # If current date is not set in cookies or badly formatted, select a random country.
        try:
            if current_date:
                country_today = self.get_queryset().filter(used_at=current_date)
            else:
                raise NoCurrentDateCookieException
        except (django.core.exceptions.ValidationError, NoCurrentDateCookieException):
            country_today = select_random_country()
        
        country_serializer = CountrySerializer(country_today.get(), context={'request': request})
        
        return Response(country_serializer.data, status=HTTP_200_OK)


class CountryExistsView(GenericAPIView):
    queryset = Country.objects.all()
    serializer_class = CountryExistsSerializer
    allowed_methods = ['POST']
    
    def post(self, request, *args, **kwargs):
        country_serializer = self.get_serializer(data=request.data)
        
        if country_serializer.is_valid():
            guessed_country_name = country_serializer.data['name']
            try:
                queried_country = self.get_queryset().get(name__iexact=guessed_country_name.lower())
            except Country.DoesNotExist:
                queried_country = None

            if queried_country:
                response_country_serializer = CountryExistsSerializer({
                    'name': queried_country.name,
                    'exists': True,
                })
            else:
                response_country_serializer = CountryExistsSerializer({
                    'name': guessed_country_name,
                    'exists': False,
                })
            
            return Response(data=response_country_serializer.data, status=HTTP_200_OK)
        else:
            return Response(data='Country data is invalid.', status=HTTP_400_BAD_REQUEST)


class GameStateView(GenericAPIView):
    serializer_class = GameSateSerializer
    allowed_methods = ['GET', 'POST']
    
    def get(self, request, *args, **kwargs):
        # TODO: rewrite game state logic using Django Session framework
        game_state = {
            'finished_today': False,
            'game_state': 'wait',
            'number_tries': settings.NUMBER_TRIES,
        }
        
        game_state_serializer = self.get_serializer(game_state)
        return Response(game_state_serializer.data)
    
    def post(self, request, *args, **kwargs):
        game_state_serializer = self.get_serializer(data=request.data)
        if game_state_serializer.is_valid():
            # Integrate Session framework here
            return Response(data=game_state_serializer.data, status=HTTP_200_OK)
        else:
            return Response(data='Game state data is invalid.', status=HTTP_400_BAD_REQUEST)
