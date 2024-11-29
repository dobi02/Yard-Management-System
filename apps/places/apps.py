from django.apps import AppConfig


class PlacesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.places'

    def ready(self):
        import apps.places.signals
