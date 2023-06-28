from django.core.management.base import BaseCommand, CommandError
from game.tasks import reset_countries_dates


class Command(BaseCommand):
    help = "Resets used_at dates for Country instances."
    
    def handle(self, *args, **options):
        reset_countries_dates()
        
        self.stdout.write(
            self.style.SUCCESS('Successfully reset dates.')
        )
