import base64
import logging

from django.core.files.base import ContentFile
from works.models import (Favorite, Material, Work, WorksMaterials,
                            Tag)
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from users.models import User

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
                  'last_name', 'password')

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


class TagWorkserializer(serializers.ModelSerializer):
    """Сериализатор для связи тега с работой."""
    class Meta:
        fields = ('id',)
        model = Tag


class MaterialSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Material."""
    class Meta:
        model = Material
        fields = ('id', 'name')


class MaterialWorkserializer(serializers.ModelSerializer):
    """Сериализатор для модели связи работы и материала."""

    id = serializers.PrimaryKeyRelatedField(
        queryset=Material.objects.all(),
        source='material',
        write_only=True
    )
    name = serializers.CharField(source='material.name', read_only=True)
    
    class Meta:
        model = WorksMaterials
        fields = ('id', 'name')


class WorkSaveSerializer(serializers.ModelSerializer):
    """
    Сериализатор для добавления и обновления работы.
    """

    author = UserSerializer(
        read_only=True, default=serializers.CurrentUserDefault()
    )
    materials = MaterialWorkserializer(
        many=True, source='works_materials'
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
        materials_data = data.get('works_materials')
        materials_set = set()

        for material_data in materials_data:
            material = material_data.get('material')
            
            if not material:
                raise serializers.ValidationError(
                    'Материал не указан'
                )

            material_tuple = (material.id)
            if material_tuple in materials_set:
                raise serializers.ValidationError(
                    'В работу нельзя добавлять два одинаковых материала'
                )
            materials_set.add(material_tuple)

        return data

    def create(self, validated_data):
        """Создаёт новую работу."""

        materials_data = validated_data.pop('works_materials')
        tags_data = validated_data.pop('tags')
        work = Work.objects.create(**validated_data)
        work.tags.set(tags_data)

        materials_to_create = []
        for material_data in materials_data:
            material = material_data.get('material')
            materials_to_create.append(
                WorksMaterials(
                    work=work,
                    material=material
                )
            )
        WorksMaterials.objects.bulk_create(materials_to_create)
        return work

    def update(self, instance, validated_data):
        """Обновляет существующую работу."""

        tags = validated_data.pop('tags')
        materials = validated_data.pop('works_materials')
        validated_data.pop('author', None)
        WorksMaterials.objects.filter(work=instance).delete()
        instance.tags.set(tags)
        self.get_materials(instance, materials)
        return super().update(instance, validated_data)

    def get_materials(self, work, materials_data):
        """Получает материалы для работы."""

        materials_to_create = []
        for material_data in materials_data:
            material = material_data.get('material')
            materials_to_create.append(
                WorksMaterials(
                    work=work,
                    material=material,
                )
            )
        WorksMaterials.objects.bulk_create(materials_to_create)
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
    materials = MaterialWorkserializer(
        many=True, read_only=True, source='works_materials')
    is_favorited = serializers.SerializerMethodField()
    image = Base64ImageField(required=False)

    def get_is_favorited(self, obj):
        """
        Проверяет, добавлена ли работа в избранное у текущего пользователя.
        """
        request = self.context.get('request')
        return request.user.is_authenticated and Favorite.objects.filter(
            user=request.user, work=obj).exists()

    class Meta:
        model = Work
        fields = '__all__'
        read_only_fields = ('id', 'author',)


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
