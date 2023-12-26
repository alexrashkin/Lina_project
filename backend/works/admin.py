from django.contrib import admin

from .models import Favorite, Ingredient, Work, ShoppingCart, Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    """Модель тегов в админке."""
    list_display = ('name', 'slug')


@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    """Модель материалов в админке."""
    list_display = ('name', 'measurement_unit')
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


@admin.register(ShoppingCart)
class ShoppingCartAdmin(admin.ModelAdmin):
    """Модель списка покупок в админке."""
    list_display = ('id', 'user', 'work')
