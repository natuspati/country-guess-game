import factory
from model_bakery import baker
import pytest
from PIL import Image
from io import BytesIO
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from game.models import Country, UserStats


def create_temporary_image_file():
    image_data = BytesIO()
    image = Image.new('RGB', (100, 100), 'white')
    image.save(image_data, format='png')
    image_data.seek(0)
    return SimpleUploadedFile("aaa.png", image_data.read(), content_type='image/png')


class CountryModelFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Country
    
    name = factory.Faker('country')
    capital = factory.Faker('city')
    region = factory.Faker(
        'random_element', elements=[x[0] for x in settings.COUNTRY_REGIONS]
    )
    population = factory.Faker('pyint')
    flag = None


class CountryModelWithFlagFactory(CountryModelFactory):
    flag = create_temporary_image_file()
    