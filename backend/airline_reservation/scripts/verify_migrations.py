import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_reservation.settings')
django.setup()

from django.apps import apps
from django.db import connection

def verify_migrations():
    print("Checking Migrations:")
    for app_config in apps.get_app_configs():
        if app_config.name.startswith('django.'):
            continue
        
        app_name = app_config.name.split('.')[-1]
        
        try:
            # Check if migrations exist
            cursor = connection.cursor()
            cursor.execute(f"SELECT * FROM django_migrations WHERE app = '{app_name}'")
            migrations = cursor.fetchall()
            
            print(f"{app_name.upper()} App:")
            print(f"  Migrations Applied: {len(migrations)}")
            
            # List applied migrations
            for migration in migrations:
                print(f"  - {migration[2]}")
        
        except Exception as e:
            print(f"Error checking {app_name} migrations: {e}")

def main():
    verify_migrations()

if __name__ == '__main__':
    main()