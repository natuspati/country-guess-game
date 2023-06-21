from country_guess.settings.base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool('DJANGO_DEBUG', False)

DATABASES = {'default': env.dj_db_url('DATABASE_URL', 'sqlite:///db.sqlite3')}

CACHES = {'default': env.dj_cache_url('CACHE_URL')}
