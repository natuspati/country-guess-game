from model_bakery import baker
import pytest

from game.models import Country
from tests.game.factories import MyModelFactory

pytestmark = pytest.mark.django_db


class TestCountryEndpoints:
    endpoint = '/api/v1/game/country/'
    
    def test_list(self, api_client):
        baker.make(Country, _quantity=3)
        
        response = api_client().get(self.endpoint)
        
        assert response.status_code == 200
        assert len(response.json()['results']) == 3
    
    def test_create(self, admin_client):
        country = MyModelFactory.build()
        
        expected_json = {
            'name': country.name,
            'capital': country.capital,
            'region': 'AM',
            'population': country.population,
            'flag': country.flag,
        }
        
        response = admin_client.post(
            self.endpoint,
            data=expected_json,
            format='multipart'
        )
        
        assert response.status_code == 201
        expected_json.pop('flag')  # Test flag in a different method
        for key in expected_json:
            assert response.json()[key] == expected_json[key]
            
    # def test_retrieve(self, api_client):
    #     country = baker.make(Country)
    #     expected_json = {
    #         'name': country.name,
    #         'capital': country.capital,
    #         'region': 'AM',
    #         'population': country.population,
    #         'flag': country.flag,
    #     }
    #     url = f'{self.endpoint}{country.slug}/'
    #
    #     response = api_client().get(url)
    #
    #     assert response.status_code == 200
    #     assert response.json() == expected_json
