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
        unique=True,
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


class Ingredient(models.Model):
    """Создание модели ингредиента."""

    name = models.CharField(
        max_length=100,
        verbose_name="Название ингредиента",
    )
    measurement_unit = models.CharField(
        max_length=20,
        verbose_name="Единица измерения",
    )

    class Meta:
        verbose_name = "Ингредиент"
        verbose_name_plural = "Ингредиенты"

    def __str__(self):
        return f'{self.name}, {self.measurement_unit}'


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
    ingredients = models.ManyToManyField(
        Ingredient,
        verbose_name="Список ингредиентов",
        related_name="works",
    )
    tags = models.ManyToManyField(
        Tag,
        verbose_name="Список тегов",
    )
    cooking_time = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(600),
        ],
        verbose_name="Время приготовления",
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


class WorksIngredients(models.Model):
    """Создание модели связанных ингредиентов в работах."""

    work = models.ForeignKey(
        Work,
        on_delete=models.CASCADE,
        related_name="works_ingredients",
    )
    ingredient = models.ForeignKey(
        Ingredient,
        on_delete=models.CASCADE,
        related_name="used_in_works",
    )
    amount = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1, message='Минимальное кол-во ингред-ов 1'),
            MaxValueValidator(50, message='Максимальное кол-во ингред-ов 50')
        ],
        verbose_name="Количество"
    )

    class Meta:
        verbose_name = "Ингредиент в работе"
        verbose_name_plural = "Ингредиенты в работах"

    def __str__(self):
        return f'{self.ingredient} в {self.work}'


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
