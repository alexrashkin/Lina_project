from django.contrib import admin

from .models import Favorite, Material, Tag, Work


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    """Модель тегов в админке."""
    list_display = ('name', 'slug')


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    """Модель материалов в админке."""
    list_display = ['name']
    list_filter = ['name']
    search_fields = ('name',)


@admin.register(Work)
class WorkAdmin(admin.ModelAdmin):
    """Модель работы в админке."""

    list_display = ('id', 'name', 'author')
    list_filter = ('name', 'author', 'tags')

    def in_favorite(self, obj):
        count = obj.in_favorite.all().count()
        return count


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    """Модель избранного в админке."""

    list_display = ('id', 'user', 'work')
