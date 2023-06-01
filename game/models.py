from django.db import models
from django.core.validators import MinValueValidator
from django.template.defaultfilters import slugify
from django.conf import settings

from versatileimagefield.fields import VersatileImageField, PPOIField


class Country(models.Model):
    name = models.CharField(max_length=200, unique=True, null=False)
    slug = models.SlugField(unique=True, null=False)
    capital = models.CharField(max_length=200)
    region = models.CharField(max_length=200, choices=settings.COUNTRY_REGIONS)
    population = models.IntegerField(validators=[MinValueValidator(0)])
    flag = VersatileImageField(
        upload_to='flag_images', ppoi_field='ppoi', null=True, blank=True
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

    # def get_absolute_url(self):
    #     return reverse('country-detail', kwargs={'slug': self.slug})

    def __str__(self):
        return self.name

