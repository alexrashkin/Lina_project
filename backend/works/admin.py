from django.contrib import admin

from .models import Favorite, Image, Material, Tag, Work


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


class ImageInline(admin.TabularInline):
    """Инлайн для изображений в админке."""
    model = Image
    extra = 3  # Количество пустых форм для новых изображений


@admin.register(Work)
class WorkAdmin(admin.ModelAdmin):
    """Модель работы в админке."""

    list_display = ('id', 'name', 'author')
    list_filter = ('name', 'author', 'tags')
    inlines = [ImageInline]

    def in_favorite(self, obj):
        count = obj.in_favorite.all().count()
        return count


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    """Модель избранного в админке."""

    list_display = ('id', 'user', 'work')


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    """Модель изображений в админке."""

    list_display = ('work', 'image')
