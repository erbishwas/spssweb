import os
from django.core.wsgi import get_wsgi_application
#from whitenoise import WhiteNoise

# Set the default settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Create the WSGI application
application = get_wsgi_application()

# Determine base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Serve static files with WhiteNoise
#application = WhiteNoise(application, root='/home/technic3/public_html/backend/staticfiles/')

