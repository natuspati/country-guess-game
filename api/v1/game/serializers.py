from django.utils.text import slugify
from django.conf import settings

from rest_framework import serializers
from versatileimagefield.serializers import VersatileImageFieldSerializer

from game.models import Country, UserStats


class CountrySerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False)
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
            'slug',
            'name',
            'capital',
            'region',
            'population',
            'flag',
            'modified_at',
            'used_at',
        )
        
        readonly = 'used_at'
    
    # Object-level validation in case slug is not provided.
    def validate(self, data):
        if not data.get('slug') and data.get('name'):
            data['slug'] = slugify(data['name'])
        return data


class UserStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStats
        fields = (
            'score',
            'last_played',
            'last_game_state',
            'last_number_tries',
        )
