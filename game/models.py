from django.db import models
from django.core.validators import MinValueValidator
from django.template.defaultfilters import slugify
from django.conf import settings
from django.contrib.sessions.models import Session

from versatileimagefield.fields import VersatileImageField, PPOIField


class Country(models.Model):
    name = models.CharField(max_length=200, unique=True, null=False)
    slug = models.SlugField(unique=True, null=False)
    capital = models.CharField(max_length=200)
    region = models.CharField(max_length=200, choices=settings.COUNTRY_REGIONS)
    population = models.IntegerField(validators=[MinValueValidator(0)])
    flag = VersatileImageField(
        upload_to='flag_images', ppoi_field='ppoi', null=True, blank=True,
    )
    ppoi = PPOIField(null=True, blank=True)
    modified_at = models.DateTimeField(auto_now=True)
    used_at = models.DateField(null=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = 'Country'
        verbose_name_plural = 'Countries'
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        return super().save(*args, **kwargs)
    
    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ["slug"]
        else:
            return []
    
    def __str__(self):
        return self.name


class UserStats(models.Model):
    session = models.OneToOneField(Session, on_delete=models.CASCADE, primary_key=True)
    score = models.IntegerField(default=0)
    last_played = models.DateField(auto_now=True)
    last_game_state = models.CharField(max_length=10, choices=settings.GAME_STATE_OPTIONS,
                                       default=settings.DEFAULT_GAME_STATE_OPTION)
    last_number_tries = models.IntegerField(default=settings.NUMBER_TRIES)
    
    def __str__(self):
        return 'ID: {} last played on {} '.format(self.session_id, self.last_played)
