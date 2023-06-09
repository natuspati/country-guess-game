from django.contrib import admin

from game.models import Country, UserStats

# Register your models here.
admin.site.register(Country)
admin.site.register(UserStats)
