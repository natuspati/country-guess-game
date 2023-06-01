from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

import requests
from urllib.request import urlopen, Request
import time
import logging

from game.models import Country

logger = logging.getLogger(__name__)


def reset_countries_dates():
    logger.info('Reset of Country used_at date initialized.')
    
    # Calculate the next date to schedule this task
    today = timezone.now().date()
    country_set = Country.objects.all().order_by('?')
    
    # Fill out the used at dates for each country in random order
    for country in country_set:
        today += timedelta(days=1)
        country.used_at = today
        country.save()


def update_country_model():
    logger.info('Update of Country model initialized.')
    resp = requests.get(settings.REST_COUNTRIES_ENDPOINT)
    
    region_dict = {}
    for region_tuple in settings.COUNTRY_REGIONS:
        region_dict[region_tuple[1]] = region_tuple[0]
    
    # Update data for each country.
    for i, country_dict in enumerate(resp.json()):
        if country_dict.get('independent') is True:
            time.sleep(1)
            
            try:
                flag_url = country_dict['flags']['png']
            except KeyError:
                flag_file = None
            else:
                flag_temp = NamedTemporaryFile(delete=True)
                mozilla_request = Request(url=flag_url, headers={'User-Agent': 'Mozilla/5.0'})
                
                with urlopen(mozilla_request) as uo:
                    assert uo.status == 200
                    flag_temp.write(uo.read())
                    flag_temp.flush()
                
                flag_file = File(flag_temp)
            
            country, created = Country.objects.update_or_create(
                name=country_dict['name']['common'],
                defaults={
                    'capital': country_dict['capital'][0],
                    'region': region_dict[country_dict['region']],
                    'population': country_dict['population'],
                    'flag': None
                }
            )
            
            if flag_file:
                country.flag.save(
                    '{}.png'.format(country.slug),
                    flag_file,
                    save=True
                )
    
    # Set dates to to_be_used_at date.
    reset_countries_dates()
