from country_guess.settings.base import *

prod_env = Env()
prod_env.read_env('.env.prod')

DEBUG = prod_env.str('DJANGO_DEBUG', 'False')

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

SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'root': {'level': 'INFO', 'handlers': ['file']},
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/django.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
