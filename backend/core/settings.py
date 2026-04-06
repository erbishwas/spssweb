

import os


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = 'your-secret-key'

DEBUG = True



USE_TZ = True
TIME_ZONE = 'Asia/Kathmandu' 


#ALLOWED_HOSTS = ['technicalpashupati.edu.np', 'www.technicalpashupati.edu.np']
ALLOWED_HOSTS = ['*']  # For development only, use specific domains in production

ADMIN_SITE_VIEW_SITE_URL = 'https://technicalpashupati.edu.np/'

CORS_ALLOW_ALL_ORIGINS = True  # More secure than True
CORS_ALLOWED_ORIGINS = [
    "https://technicalpashupati.edu.np",  # Vite dev server
     
]

CSRF_TRUSTED_ORIGINS = [
    'https://technicalpashupati.edu.np',
    'https://www.technicalpashupati.edu.np',
]

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',  # Default backend
]

LOGIN_URL = 'two_factor:login'
LOGIN_REDIRECT_URL = '/backend/admin/'
TWO_FACTOR_PATCH_ADMIN = True


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # 'django_otp',
    # 'django_otp.plugins.otp_static',
    # 'django_otp.plugins.otp_totp',
    # 'two_factor',
    'rest_framework',
    'main',
]

MIDDLEWARE = [
   
    
    'django.middleware.security.SecurityMiddleware',
    #"whitenoise.middleware.WhiteNoiseMiddleware",
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    #'django_otp.middleware.OTPMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
]   

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
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

WSGI_APPLICATION = 'core.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'spssweb',
        'USER': 'root',
        'PASSWORD': 'root',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ]
}

# FORCE_SCRIPT_NAME = '/backend'
# STATIC_URL = '/backend/static/'
# STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')] 
# STATIC_ROOT = '/home/technic3/public_html/backend/staticfiles/'

# MEDIA_URL = '/backend/media/'
# MEDIA_ROOT = '/home/technic3/public_html/backend/media/'

STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'staticfiles')] 
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "attendance-sync",
    }
}