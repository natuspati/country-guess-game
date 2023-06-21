import pytest
import factory

from tests.game.factories import CountryModelFactory, CountryModelWithFlagFactory
from api.v1.game.serializers import CountryDetailSerializer

pytestmark = pytest.mark.django_db


class TestCountrySerializer:
    @pytest.mark.unit
    def test_serialize_model(self):
        country = CountryModelFactory.build()
        serializer = CountryDetailSerializer(country)
        
        assert serializer.data
    
    @pytest.mark.unit
    def test_serialized_data(self, mocker):
        valid_serialized_data = factory.build(
            dict,
            FACTORY_CLASS=CountryModelWithFlagFactory,
        )
        
        serializer = CountryDetailSerializer(data=valid_serialized_data)
        
        assert serializer.is_valid()
        assert serializer.errors == {}
