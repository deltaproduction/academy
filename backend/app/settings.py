from configparser import RawConfigParser
from datetime import timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

config = RawConfigParser()

config_path_prod = BASE_DIR / 'academy.conf'

if config_path_prod.exists() and config_path_prod.is_file():
    config.read(config_path_prod)

SECRET_KEY = config.get('default', 'SECRET_KEY', fallback='secret_key')

DEBUG = config.getboolean('default', 'DEBUG', fallback=False)

_allowed_hosts = config.get('default', 'ALLOWED_HOSTS', fallback=None)

ALLOWED_HOSTS = _allowed_hosts.split(' ') if _allowed_hosts else []

_csrf_trusted_origins = config.get('default', 'CSRF_TRUSTED_ORIGINS', fallback=None)

CSRF_TRUSTED_ORIGINS = _csrf_trusted_origins.split(' ') if _csrf_trusted_origins else ALLOWED_HOSTS


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',

    'utils',
    'users',
    'classes',
    'courses',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'utils.api_auth.jwt_middleware.JWTMiddleware',
]

ROOT_URLCONF = 'app.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

WSGI_APPLICATION = 'app.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': config.get('database', 'DATABASE_BACKEND', fallback='django.db.backends.mysql'),
        'NAME': config.get('database', 'DATABASE_NAME', fallback='academy'),
        'USER': config.get('database', 'DATABASE_USER', fallback='academy'),
        'PASSWORD': config.get('database', 'DATABASE_PASSWORD', fallback='password'),
        'HOST': config.get('database', 'DATABASE_HOST', fallback='127.0.0.1'),
        'PORT': config.getint('database', 'DATABASE_PORT', fallback=3306),
        'OPTIONS': {
            'charset': 'utf8',
        },
        'TEST_CHARSET': 'utf8',
    }
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

AUTH_USER_MODEL = 'users.User'

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

LANGUAGE_CODE = 'ru-ru'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATIC_URL = '/static/'

STATIC_ROOT = BASE_DIR / 'collected_static'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(minutes=15, days=45),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
}

TCS_FILES_PATH = BASE_DIR / "media/tcs_files/"
CODE_FILES_PATH = BASE_DIR / "media/code_files/"

ACCESS_TOKEN_COOKIE_NAME = 'access_token'
REFRESH_TOKEN_COOKIE_NAME = 'refresh_token'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'utils.api_auth.auth_backends.JWTCookieAuthentication',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'djangorestframework_camel_case.render.CamelCaseJSONRenderer',
    ),
}

try:
    # noinspection PyUnresolvedReferences
    from .local_settings import DEBUG
except ImportError:
    pass

try:
    from .local_settings import *
except ImportError:
    pass
