import pytest

from game.models import Country, UserStats
from api.v1.game.serializers import CountryDetailSerializer
from tests.game.factories import CountryModelFactory, CountryModelWithFlagFactory

pytestmark = pytest.mark.django_db


class TestCountryViews:
    endpoint = '/api/v1/game/country/'
    
    def test_list(self, api_client):
        CountryModelFactory.create_batch(3)
        
        response = api_client.get(self.endpoint)
        
        assert response.status_code == 200
        assert len(response.json()['results']) == 3
    
    def test_create(self, admin_client):
        country = CountryModelFactory.build()
        
        expected_json = {
            'name': country.name,
            'capital': country.capital,
            'region': country.region,
            'population': country.population,
        }
        
        response = admin_client.post(
            self.endpoint,
            data=expected_json,
            format='multipart'
        )
        
        assert response.status_code == 201
        for key in expected_json:
            assert response.json()[key] == expected_json[key]
    
    def test_retrieve(self, api_client):
        country = CountryModelFactory()
        url = f'{self.endpoint}{country.slug}/'
        
        response = api_client.get(url)
        
        assert response.status_code == 200
        assert response.json() == CountryDetailSerializer(country).data
    
    def test_update(self, rf, admin_client):
        old_country = CountryModelFactory()
        new_country = CountryModelFactory.build()
        
        expected_json = {
            'name': new_country.name,
            'capital': new_country.capital,
            'region': new_country.region,
            'population': new_country.population,
        }
        
        url = f'{self.endpoint}{old_country.slug}/'
        
        response = admin_client.put(
            url,
            expected_json,
            content_type='application/json'
        )
        
        assert response.status_code == 200
        for key in expected_json:
            assert response.json()[key] == expected_json[key]
    
    @pytest.mark.parametrize('field', [
        'name',
        'capital',
        'region',
        'population',
    ])
    def test_partial_update(self, rf, field, admin_client):
        old_country = CountryModelFactory()
        new_country = CountryModelFactory.build()
        
        new_country_dict = {
            'name': new_country.name,
            'capital': new_country.capital,
            'region': new_country.region,
            'population': new_country.population,
        }
        
        valid_field = new_country_dict[field]
        url = f'{self.endpoint}{old_country.slug}/'
        
        response = admin_client.patch(
            url,
            {field: valid_field},
            content_type='application/json'
        )
        
        assert response.status_code == 200
        assert response.json()[field] == valid_field
    
    def test_delete(self, admin_client):
        country = CountryModelFactory()
        url = f'{self.endpoint}{country.slug}/'
        
        response = admin_client.delete(url)
        
        assert response.status_code == 204
        assert Country.objects.all().count() == 0


class TestUserStatsViews:
    endpoint = '/api/v1/game/stats/'
    
    def test_retrieve(self, api_client):
        CountryModelFactory.create_batch(3)
        
        response = api_client.get(self.endpoint)
        
        assert response.status_code == 200
        assert len(UserStats.objects.all()) == 1
    
    def test_update(self, rf, api_client):
        expected_json = {
            'score': 1,
            'last_game_state': 'success',
            'last_number_tries': 2
        }
        
        response = api_client.put(
            self.endpoint,
            expected_json
        )
        
        assert response.status_code == 201
        assert len(UserStats.objects.all()) == 1
        