from django.utils.text import slugify

from rest_framework import serializers
from versatileimagefield.serializers import VersatileImageFieldSerializer

from game.models import Country, UserStats


class CountryDetailSerializer(serializers.ModelSerializer):
    region = serializers.CharField(source='get_region_display')
    flag = VersatileImageFieldSerializer(
        sizes=[
            ('full_size', 'url'),
            ('thumbnail', 'thumbnail__100x100'),
        ]
    )
    
    class Meta:
        model = Country
        fields = (
            'name',
            'capital',
            'region',
            'population',
            'flag',
            'modified_at',
            'used_at',
        )
        
        readonly = 'used_at'


class CountrySerializer(CountryDetailSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='country-detail', lookup_field='slug', read_only=True)
    
    class Meta(CountryDetailSerializer.Meta):
        fields = CountryDetailSerializer.Meta.fields + ('url',)
    
    # # Object-level validation in case slug is not provided.
    # def validate(self, data):
    #     if not data.get('slug') and data.get('name'):
    #         data['slug'] = slugify(data['name'])
    #     return data


class UserStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStats
        fields = (
            'score',
            'last_played',
            'last_game_state',
            'last_number_tries',
        )
