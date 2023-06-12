from model_bakery import baker
import json
import pytest

from game.models import Country

pytestmark = pytest.mark.django_db


class TestCountryEndpoints:
    endpoint = 'game/country/'
    
    def test_list(self, api_client):
        response = api_client().get('')
        print(response)
        assert response.status_code == 200
