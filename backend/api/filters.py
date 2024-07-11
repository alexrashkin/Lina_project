import django_filters
import django_filters.rest_framework as filters
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


class WorkFilter(filters.FilterSet):
    tags = filters.ModelMultipleChoiceFilter(
        field_name='tags__slug',
        to_field_name='slug',
        queryset=Tag.objects.all(),
    )
    author = filters.ModelChoiceFilter(queryset=User.objects.all())

    class Meta:
        model = Work
        fields = ('tags', 'author')

    def filter_queryset(self, queryset):
        tags = self.data.get('tags')
        # Добавим отладочные сообщения
        print(f"Tags: {tags}")

        # Если значение равно "__all__", не фильтруем по тегам
        if tags == "__all__":
            print("Returning unfiltered queryset")
            return queryset

        # Если теги не указаны, возвращаем пустой QuerySet
        if not tags:
            print("Returning empty queryset")
            return Work.objects.none()

        # В остальных случаях используем стандартную фильтрацию
        print("Using default filtering")
        return super().filter_queryset(queryset)