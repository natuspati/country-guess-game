from django.views.generic import TemplateView


class IndexView(TemplateView):
    template_name = 'game/index.html'


class CountryListView(TemplateView):
    template_name = 'game/country_list.html'
