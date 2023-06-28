from country_guess.settings.base import *

import django_cache_url

DEBUG = True

SECRET_KEY = 'django-insecure-g4@itb4*-x$cec4q^2ck7ke&zc8hgx*9e-q%0mwcycnpvy19!%'

ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

CACHES = {'default': django_cache_url.parse('dummy://')}
