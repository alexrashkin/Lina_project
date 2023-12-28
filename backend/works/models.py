from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

User = get_user_model()


class Tag(models.Model):
    """Создание модели тега."""

    name = models.CharField(
        verbose_name="Название тега",
        unique=True,
        max_length=50,
    )

    color = models.CharField(
        verbose_name="Цветовой HEX-код",
        unique=False,
        max_length=7,
    )

    slug = models.SlugField(
        verbose_name="Уникальный слаг",
        unique=True,
        max_length=50,
    )

    class Meta:
        verbose_name = "Тег"
        verbose_name_plural = "Теги"

    def __str__(self):
        return self.name


class Material(models.Model):
    """Создание модели материала."""

    name = models.CharField(
        max_length=100,
        verbose_name="Название материала",
    )
    
    class Meta:
        verbose_name = "Материал"
        verbose_name_plural = "Материалы"

    def __str__(self):
        return f'{self.name}'


class Work(models.Model):
    """Создание модели работы."""

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Автор публикации",
        related_name="works",
    )
    name = models.CharField(
        max_length=150,
        verbose_name="Название",
    )
    image = models.ImageField(
        upload_to="works/images/",
        verbose_name="Картинка",
    )
    text = models.TextField(
        verbose_name="Описание",
    )
    materials = models.ManyToManyField(
        Material,
        verbose_name="Список материалов",
        related_name="works",
    )
    tags = models.ManyToManyField(
        Tag,
        verbose_name="Список тегов",
    )
    pub_date = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата публикации"
    )

    class Meta:
        ordering = ('-pub_date', )
        verbose_name = "Работа"
        verbose_name_plural = "Работы"

    def __str__(self):
        return self.name


class WorksMaterials(models.Model):
    """Создание модели связанных материалов в работах."""

    work = models.ForeignKey(
        Work,
        on_delete=models.CASCADE,
        related_name="works_materials",
    )
    material = models.ForeignKey(
        Material,
        on_delete=models.CASCADE,
        related_name="used_in_works",
    )
    
    class Meta:
        verbose_name = "Материал в работе"
        verbose_name_plural = "Материалы в работах"

    def __str__(self):
        return f'{self.material} в {self.work}'


class Favorite(models.Model):
    """Создание модели избранного."""

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Пользователь",
    )
    work = models.ForeignKey(
        Work,
        on_delete=models.CASCADE,
        related_name="favorites",
        verbose_name="Работа",
    )

    class Meta:
        verbose_name = "Избранная работа"
        verbose_name_plural = "Избранные работы"
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'work'],
                name='unique_favorite'
            )
        ]

    def __str__(self):
        return f'{self.work} {self.user}'


class ShoppingCart(models.Model):
    """Создание модели списка покупок."""

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Пользователь",
    )
    work = models.ForeignKey(
        Work,
        on_delete=models.CASCADE,
        related_name="shopping_cart",
        verbose_name="Работа",
    )

    class Meta:
        verbose_name = 'Список покупок'
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'work'],
                name='unique_shopping_cart'
            )
        ]

    def __str__(self):
        return f'{self.work} в списке у {self.user}'
