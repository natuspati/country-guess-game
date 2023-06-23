from country_guess.settings.base import *

prod_env = Env()
prod_env.read_env('.env.prod')

DEBUG = False

SECRET_KEY = prod_env.str('DJANGO_SECRET_KEY')

ALLOWED_HOSTS = prod_env.list('DJANGO_ALLOWED_HOSTS')

DATABASES = {
    'default': {
        'ENGINE': prod_env.str('POSTGRES_ENGINE'),
        'NAME': prod_env.str('POSTGRES_DB'),
        'USER': prod_env.str('POSTGRES_USER'),
        'PASSWORD': prod_env.str('POSTGRES_PASSWORD'),
        'HOST': prod_env.str('POSTGRES_HOST'),
        'PORT': prod_env.int('POSTGRES_PORT'),
    }
}

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://@{}:{}'.format(
            env.str('REDIS_HOST'),
            env.int('REDIS_PORT')
        ),
    }
}

# Performance considerations
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'

# TODO: add SSL certification and prepare for deployment
# Security considerations
# SECURE_SSL_REDIRECT = True
# CSRF_COOKIE_SECURE = True
