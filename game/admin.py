from django.contrib import admin
from django.contrib.sessions.models import Session

from game.models import Country, UserStats

# Register your models here.
admin.site.register(Country)
admin.site.register(UserStats)
admin.site.register(Session)
