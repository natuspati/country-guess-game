from country_guess.settings.base import *

import django_cache_url

dev_env = Env()
dev_env.read_env('.env.dev')

DEBUG = True

SECRET_KEY = 'django-insecure-g4@itb4*-x$cec4q^2ck7ke&zc8hgx*9e-q%0mwcycnpvy19!%'

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

DATABASES = {
    'default': {
        'ENGINE': dev_env.str('POSTGRES_ENGINE', 'django.db.backends.sqlite3'),
        'NAME': dev_env.str('POSTGRES_DB', BASE_DIR / 'db.sqlite3'),
        'USER': dev_env.str('POSTGRES_USER', 'user'),
        'PASSWORD': dev_env.str('POSTGRES_PASSWORD', 'password'),
        'HOST': dev_env.str('POSTGRES_HOST', 'localhost'),
        'PORT': dev_env.int('POSTGRES_PORT', 5432),
    }
}

CACHES = {'default': django_cache_url.parse('dummy://')}
