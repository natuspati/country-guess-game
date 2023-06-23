from country_guess.settings.base import *

prod_env = Env()
prod_env.read_env('.env.prod')

DEBUG = False

SECRET_KEY = prod_env.str('DJANGO_SECRET_KEY')

ALLOWED_HOSTS = prod_env.list('DJANGO_ALLOWED_HOSTS')

DATABASES = {'default': prod_env.dj_db_url('DATABASE_URL')}

CACHES = {'default': prod_env.dj_cache_url('CACHE_URL')}
