import django_filters
from django.contrib.auth import get_user_model
from works.models import Material, Tag, Work

User = get_user_model()


class MaterialFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(
        field_name='name',
        lookup_expr='istartswith'
    )

    class Meta:
        model = Material
        fields = ['name']


class WorkFilter(django_filters.FilterSet):
    tags = django_filters.ModelMultipleChoiceFilter(
        field_name='tags__slug',
        to_field_name='slug',
        queryset=Tag.objects.all(),
    )
    author = django_filters.ModelChoiceFilter(queryset=User.objects.all())

    class Meta:
        model = Work
        fields = ('tags', 'author')
