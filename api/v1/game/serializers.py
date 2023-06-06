from django.utils.text import slugify
from django.conf import settings

from rest_framework import serializers
from versatileimagefield.serializers import VersatileImageFieldSerializer

from game.models import Country


class CountrySerializer(serializers.ModelSerializer):
    slug = serializers.CharField(required=False)
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


class CountryExistsSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    exists = serializers.BooleanField(default=False, required=False)


class GameSateSerializer(serializers.Serializer):
    finished_today = serializers.BooleanField()
    game_state = serializers.ChoiceField(settings.GAME_STATE_OPTIONS, allow_blank=False)
    number_tries = serializers.IntegerField(default=settings.NUMBER_TRIES)
