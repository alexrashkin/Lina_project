import base64
import logging

from django.core.files.base import ContentFile
from works.models import (Favorite, Ingredient, Work, WorksIngredients,
                            ShoppingCart, Tag)
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from users.models import Subscription, User

logger = logging.getLogger(__name__)


class Base64ImageField(serializers.ImageField):
    """
    Кастомное поле для сериализации изображения в формате base64.
    """

    def to_internal_value(self, data):
        """
        Преобразует строку данных изображения в объект ContentFile.
        """
        if isinstance(data, str) and data.startswith('data:image'):
            format, imgstr = data.split(';base64,')
            ext = format.split('/')[-1]
            data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
        return super().to_internal_value(data)


class UserSerializer(serializers.ModelSerializer):
    """Сериализатор для пользовательской модели."""

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name',
                  'last_name', 'password', 'is_subscribed')

    def create(self, validated_data):
        """
        Создает и сохраняет нового пользователя.
        """
        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def get_is_subscribed(self, obj):
        """
        Возвращает True, если текущий пользователь подписан на автора.
        """
        user = self.context['request'].user
        if user.is_anonymous:
            return False
        return Subscription.objects.filter(user=user, author=obj).exists()

    def to_representation(self, instance):
        """Функция для измения представления при GET и POST запросах."""
        instance = super().to_representation(instance)
        if self.context.get('request').method == 'POST':
            instance.pop('is_subscribed')
        return instance


class GetUserSubscribesSerializer(UserSerializer):
    """
    Сериализатор для получения информации о подписках пользователя.
    """
    is_subscribed = serializers.SerializerMethodField()
    works = serializers.SerializerMethodField()
    works_count = serializers.SerializerMethodField()


class ChangePasswordSerializer(serializers.Serializer):
    """
    Сериализатор для изменения пароля пользователя.
    """
    model = User
    new_password = serializers.CharField(max_length=150, required=True)
    current_password = serializers.CharField(max_length=150, required=True)

    def validate_current_password(self, value):
        """
        Проверяет текущий пароль пользователя перед изменением пароля.
        """
        user = self.context.get('request').user
        if not user.check_password(value):
            raise serializers.ValidationError("Неверный пароль!")
        return value


class TagSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Tag."""

    class Meta:
        model = Tag
        fields = ('id', 'name', 'color', 'slug')


class Tagworkserializer(serializers.ModelSerializer):
    """Сериализатор для связи тега с работой."""
    class Meta:
        fields = ('id',)
        model = Tag


class IngredientSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Ingredient."""
    class Meta:
        model = Ingredient
        fields = ('id', 'name', 'measurement_unit')


class Ingredientworkserializer(serializers.ModelSerializer):
    """Сериализатор для модели связи работы и материала с количеством."""

    id = serializers.PrimaryKeyRelatedField(
        queryset=Ingredient.objects.all(),
        source='ingredient',
        write_only=True
    )
    name = serializers.CharField(source='ingredient.name', read_only=True)
    measurement_unit = serializers.CharField(
        source='ingredient.measurement_unit',
        read_only=True
    )
    amount = serializers.IntegerField()

    class Meta:
        model = WorksIngredients
        fields = ('id', 'name', 'measurement_unit', 'amount')


class WorkSaveSerializer(serializers.ModelSerializer):
    """
    Сериализатор для добавления и обновления работы.
    """

    author = UserSerializer(
        read_only=True, default=serializers.CurrentUserDefault()
    )
    ingredients = Ingredientworkserializer(
        many=True, source='works_ingredients'
    )
    image = Base64ImageField()
    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True
    )

    def validate(self, data):
        """
        Проверяет данные работы перед созданием или обновлением.
        """
        ingredients_data = data.get('works_ingredients')
        ingredients_set = set()

        for ingredient_data in ingredients_data:
            ingredient = ingredient_data.get('ingredient')
            amount = ingredient_data.get('amount')

            if not ingredient:
                raise serializers.ValidationError(
                    'Материал не указан'
                )

            if amount is not None and amount < 1:
                raise serializers.ValidationError(
                    'Количество материалов не может быть меньше 1'
                )

            ingredient_tuple = (ingredient.id, amount)
            if ingredient_tuple in ingredients_set:
                raise serializers.ValidationError(
                    'В работу нельзя добавлять два одинаковых материала'
                )
            ingredients_set.add(ingredient_tuple)

        return data

    def create(self, validated_data):
        """Создаёт новую работу."""

        ingredients_data = validated_data.pop('works_ingredients')
        tags_data = validated_data.pop('tags')
        work = Work.objects.create(**validated_data)
        work.tags.set(tags_data)

        ingredients_to_create = []
        for ingredient_data in ingredients_data:
            ingredient = ingredient_data.get('ingredient')
            amount = ingredient_data.get('amount')
            ingredients_to_create.append(
                WorksIngredients(
                    work=work,
                    ingredient=ingredient,
                    amount=amount
                )
            )
        WorksIngredients.objects.bulk_create(ingredients_to_create)
        return work

    def update(self, instance, validated_data):
        """Обновляет существующую работу."""

        tags = validated_data.pop('tags')
        ingredients = validated_data.pop('works_ingredients')
        validated_data.pop('author', None)
        WorksIngredients.objects.filter(work=instance).delete()
        instance.tags.set(tags)
        self.get_ingredients(instance, ingredients)
        return super().update(instance, validated_data)

    def get_ingredients(self, work, ingredients_data):
        """Получает материалы для работы."""

        ingredients_to_create = []
        for ingredient_data in ingredients_data:
            ingredient = ingredient_data.get('ingredient')
            amount = ingredient_data.get('amount')
            ingredients_to_create.append(
                WorksIngredients(
                    work=work,
                    ingredient=ingredient,
                    amount=amount
                )
            )
        WorksIngredients.objects.bulk_create(ingredients_to_create)
        return work

    def to_representation(self, instance):
        """
        Преобразует экземпляр модели Work в сериализованные данные.
        """
        request = self.context.get('request')

        if request.user.is_authenticated:
            is_favorited = Favorite.objects.filter(
                user=request.user, work=instance).exists()
            instance.is_favorited = is_favorited

        return super().to_representation(instance)

    class Meta:
        model = Work
        validators = [
            UniqueTogetherValidator(
                queryset=Work.objects.all(),
                fields=['author', 'name'],
                message='Работа с таким названием уже добавлена')
        ]
        fields = '__all__'
        read_only_fields = ('author',)


class WorkGetSerializer(serializers.ModelSerializer):
    """
    Сериализатор для получения информации о работе.
    """

    tags = TagSerializer(many=True, read_only=True)
    author = UserSerializer(read_only=True)
    ingredients = Ingredientworkserializer(
        many=True, read_only=True, source='works_ingredients')
    is_favorited = serializers.SerializerMethodField()
    is_in_shopping_cart = serializers.SerializerMethodField()
    image = Base64ImageField(required=False)

    def get_is_favorited(self, obj):
        """
        Проверяет, добавлена ли работа в избранное у текущего пользователя.
        """
        request = self.context.get('request')
        return request.user.is_authenticated and Favorite.objects.filter(
            user=request.user, work=obj).exists()

    def get_is_in_shopping_cart(self, obj):
        """
        Проверяет, добавлена ли работа в список покупок у текущего пользователя.
        """
        request = self.context.get('request')
        return request.user.is_authenticated and ShoppingCart.objects.filter(
            user=request.user, work=obj).exists()

    class Meta:
        model = Work
        fields = '__all__'
        read_only_fields = ('id', 'author',)


class UserSubscribeControlSerializer(UserSerializer):
    """Сериализатор для управления подпиской/отпиской пользователя."""

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name',
                  'last_name', 'is_subscribed', 'works', 'works_count')
        read_only_fields = ('email', 'username', 'first_name', 'last_name',
                            'is_subscribed', 'works', 'works_count')

    def get_works(self, obj):
        """
        Возвращает список работ пользователя с опциональным ограничением
        по количеству.
        """
        request = self.context.get('request')
        works_limit = None
        if request:
            works_limit = request.query_params.get('works_limit')
        works = obj.works.all()
        if works_limit:
            works = obj.works.all()[:int(works_limit)]
        return WorkGetSerializer(works, many=True,
                                   context={'request': request}).data

    def get_works_count(self, obj):
        """
        Возвращает общее количество работ пользователя.
        """
        return obj.works.count()


class SubscribeSerializer(serializers.ModelSerializer):
    """
    Сериализатор для работы с подпиской на пользователя.
    """

    class Meta:
        model = Subscription
        fields = ('id', 'author', 'user')
        read_only_fields = fields

    def validate(self, data):
        """
        Проверяет, можно ли подписаться на пользователя,
        иначе вызывает исключение.
        """
        author = self.context['author']
        user = self.context['request'].user
        if (
            author == user
            or Subscription.objects.filter(
                author=author,
                user=user
            ).exists()
        ):
            raise serializers.ValidationError(
                'Нельзя подписаться на этого пользователя!'
            )
        return data


class ShoppingCartSerializer(serializers.ModelSerializer):
    """Сериализатор для работы со списком покупок."""

    class Meta:
        model = ShoppingCart
        fields = '__all__'
        validators = [
            UniqueTogetherValidator(
                queryset=ShoppingCart.objects.all(),
                fields=('user', 'work'),
                message='Работа уже добавлена в список покупок'
            )
        ]

    def to_representation(self, instance):
        """
        Преобразует экземпляр модели ShoppingCart в сериализованные данные.
        """
        request = self.context.get('request')
        return WorkSaveSerializer(
            instance.work,
            context={'request': request}
        ).data


class FavoriteSerializer(serializers.ModelSerializer):
    """Сериализатор для работы с избранными работами."""

    class Meta:
        model = Favorite
        fields = '__all__'
        validators = [
            UniqueTogetherValidator(
                queryset=Favorite.objects.all(),
                fields=('user', 'work'),
                message='Работа уже добавлена в избранное'
            )
        ]

    def to_representation(self, instance):
        """
        Преобразует экземпляр модели Favorite в сериализованные данные.
        """
        request = self.context.get('request')
        return WorkSaveSerializer(
            instance.work,
            context={'request': request}
        ).data


class WorkFollowSerializer(serializers.ModelSerializer):
    image = Base64ImageField()

    class Meta:
        model = Work
        fields = ('id', 'name', 'image', 'cooking_time')
