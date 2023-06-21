from country_guess.settings.base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool('DJANGO_DEBUG', True)

DATABASES = {
    'default': dj_database_url.config(default='sqlite:///db.sqlite3'),
}

CACHES = {'default': django_cache_url.parse('dummy://')}
