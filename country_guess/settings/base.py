"""
Django settings for country_guess project.

Generated by 'django-admin startproject' using Django 4.2.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path

from environs import Env

env = Env()
env.read_env()  # read .env file, if it exists

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env.str(
    'DJANGO_SECRET_KEY',
    'django-insecure-g4@itb4*-x$cec4q^2ck7ke&zc8hgx*9e-q%0mwcycnpvy19!%'
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool('DJANGO_DEBUG', False)

ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS', ['*'])

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    'users.apps.UsersConfig',
    
    'rest_framework',
    'corsheaders',
    'django_filters',
    'drf_spectacular',
    'versatileimagefield',
    # 'factory_generator',
    
    'game.apps.GameConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'country_guess.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates', BASE_DIR / 'game/templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'country_guess.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Session settings
SESSION_COOKIE_AGE = 2 * 24 * 60 * 60  # 2 days
# SESSION_SAVE_EVERY_REQUEST = True

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Authentication
AUTH_USER_MODEL = 'users.User'
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse',
        },
    },
    'formatters': {
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'stream': 'ext://sys.stdout',
            'formatter': 'simple',
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'filters': ['require_debug_false'],
            'formatter': 'verbose',
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs/debug.log',
            'formatter': 'verbose'
        },
    },
    'loggers': {
        'game': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': True
        },
    },
}

# Django Rest Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication'
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser'
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.OrderingFilter',
        'rest_framework.filters.SearchFilter'
    ],
    'DEFAULT_PAGINATION_CLASS': 'api.v1.paginations.LargePageNumberPagination',
    'DEFAULT_THROTTLE_CLASSES': [
        'api.v1.throttling.AnonSustainedThrottle',
        'api.v1.throttling.AnonBurstThrottle',
        'api.v1.throttling.UserSustainedThrottle',
        'api.v1.throttling.UserBurstThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon_sustained': '500/day',
        'anon_burst': '100/minute',
        'user_sustained': '5000/day',
        'user_burst': '100/minute',
    },
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'SEARCH_PARAM': 'name'
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'Country Guess API',
    'DESCRIPTION': 'Description placeholder2',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': True,
}

# Game settings
COUNTRY_REGIONS_DICT = env.dict(
    'GAME_COUNTRY_REGIONS',
    subcast_keys=str,
    subcast_values=str,
)
COUNTRY_REGIONS = []
for country_tuple in COUNTRY_REGIONS_DICT.items():
    COUNTRY_REGIONS.append(country_tuple)

ORDER_REVEAL = env.list(
    'GAME_ORDER_REVEAL',
    ('capital',
     'region',
     'population',
     'flag',
     'name')
)
NUMBER_TRIES = env.int('GAME_NUMBER_OF_TRIES', 4)
GAME_STATE_OPTIONS_DICT = env.dict(
    'GAME_STATE_OPTIONS',
    subcast_keys=str,
    subcast_values=str,
)
GAME_STATE_OPTIONS = []
for game_state in GAME_STATE_OPTIONS_DICT.items():
    GAME_STATE_OPTIONS.append(game_state)
DEFAULT_GAME_STATE_OPTION = env.str('GAME_STATE_DEFAULT_OPTION', 'wait')

# REST countries API
REST_COUNTRIES_ENDPOINT = env.str('REST_COUNTRIES_ENDPOINT', 'https://restcountries.com/v3.1/all')
