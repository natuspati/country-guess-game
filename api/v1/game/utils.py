import random

from game.models import Country


def select_random_country():
    pks = Country.objects.values_list('pk', flat=True)
    random_pk = random.choice(pks)
    return Country.objects.filter(pk=random_pk)
