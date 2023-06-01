from rest_framework.pagination import PageNumberPagination


class LargePageNumberPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000


class SmallPageNumberPagination(PageNumberPagination):
    page_size = 10
