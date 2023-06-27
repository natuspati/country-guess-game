from pathlib import Path

from environs import Env

env = Env()
env.read_env('.env')

BASE_DIR = Path(__file__).resolve().parent.parent.parent

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    'users.apps.UsersConfig',
    
    'rest_framework',
    'django_filters',
    'drf_spectacular',
    'drf_spectacular_sidecar',
    'versatileimagefield',
    
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
                'game.context_processors.debug',
            ],
        },
    },
]

WSGI_APPLICATION = 'country_guess.wsgi.application'

# Session settings
SESSION_COOKIE_AGE = 2 * 24 * 60 * 60  # 2 days

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

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Authentication
AUTH_USER_MODEL = 'users.User'
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

# TODO: make Django logging work with Gunicorn and Nginx
# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'filters': {
#         'require_debug_false': {
#             '()': 'django.utils.log.RequireDebugFalse',
#         },
#     },
#     'formatters': {
#         'simple': {
#             'format': '{levelname} {message}',
#             'style': '{',
#         },
#         'verbose': {
#             'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
#             'style': '{',
#         },
#     },
#     'handlers': {
#         'console': {
#             'class': 'logging.StreamHandler',
#             'stream': 'ext://sys.stdout',
#             'formatter': 'simple',
#         },
#         'mail_admins': {
#             'level': 'ERROR',
#             'class': 'django.utils.log.AdminEmailHandler',
#             'filters': ['require_debug_false'],
#             'formatter': 'verbose',
#         },
#         'file': {
#             'level': 'DEBUG',
#             'class': 'logging.FileHandler',
#             'filename': BASE_DIR / 'logs/debug.log',
#             'formatter': 'verbose'
#         },
#     },
#     'loggers': {
#         'game': {
#             'handlers': ['console', 'file'],
#             'level': 'DEBUG',
#             'propagate': True
#         },
#     },
# }

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
        "simple": {
            "format": "{levelname} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "file": {
            "level": "DEBUG",
            "class": "logging.FileHandler",
            "filename": BASE_DIR / "logs/debug.log",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["file"],
            "propagate": True,
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
    'SWAGGER_UI_DIST': 'SIDECAR',
    'SWAGGER_UI_FAVICON_HREF': 'SIDECAR',
    'REDOC_DIST': 'SIDECAR',
    'TITLE': 'Country Guess API',
    'DESCRIPTION': 'Description placeholder',
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
