import base64
import logging
import uuid
from datetime import datetime

from django.core.files.base import ContentFile
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueTogetherValidator
from users.models import User
from works.models import Favorite, Image, Material, Tag, Work, WorksMaterials

logger = logging.getLogger(__name__)


class Base64FileField(serializers.FileField):
    """
    Custom field for serializing file in base64 format.
    """

    def to_internal_value(self, data):
        """
        Convert file data string to ContentFile object.
        """
        if isinstance(data, str) and data.startswith('data:video'):
            _, file_data = data.split(';base64,')
            decoded_file = base64.b64decode(file_data)
            return ContentFile(decoded_file)
        return super().to_internal_value(data)


class Base64ImageField(serializers.ImageField):
    """
    Custom field for serializing image in base64 format.
    """

    def to_internal_value(self, data):
        """
        Convert image data string to ContentFile object.
        """
        if isinstance(data, str) and data.startswith('data:image'):
            format, imgstr = data.split(';base64,')
            ext = format.split('/')[-1]
            data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
        return super().to_internal_value(data)


class WorksImageSerializer(serializers.ModelSerializer):
    image = Base64ImageField()

    class Meta:
        model = Image
        fields = ('image',)


class UserSerializer1(serializers.ModelSerializer):
    """Serializer for user model."""

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name',
                  'last_name', 'password')

    def create(self, validated_data):
        """
        Creates and saves a new user.
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
    Serializer for changing user password.
    """
    model = User
    new_password = serializers.CharField(max_length=150, required=True)
    current_password = serializers.CharField(max_length=150, required=True)

    def validate_current_password(self, value):
        """
        Checks current user password before changing password.
        """
        user = self.context.get('request').user
        if not user or not user.check_password(value):
            raise ValidationError("Invalid password!")
        return value


class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tag model."""

    class Meta:
        model = Tag
        fields = ('id', 'name', 'color', 'slug')


class TagWorkserializer(serializers.ModelSerializer):
    """Serializer for Tag and Work association."""
    class Meta:
        fields = ('id',)
        model = Tag


class MaterialSerializer(serializers.ModelSerializer):
    """Serializer for Material model."""
    class Meta:
        model = Material
        fields = ('id', 'name')


class MaterialWorkserializer(serializers.ModelSerializer):
    """Serializer for Work and Material association."""

    id = serializers.PrimaryKeyRelatedField(
        queryset=Material.objects.all(),
        source='material',
    )
    name = serializers.CharField(source='material.name', read_only=True)

    class Meta:
        model = WorksMaterials
        fields = ('id', 'name')


class WorkSaveSerializer(serializers.ModelSerializer):
    """
    Serializer for adding or updating a work.
    """

    author = UserSerializer1(
        read_only=True, default=serializers.CurrentUserDefault()
    )
    materials = MaterialWorkserializer(
        many=True, source='works_materials'
    )
    image = WorksImageSerializer(required=False, many=True)
    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True
    )
    video = Base64FileField(required=False)

    def validate(self, data):
        """
        Validates work data before creation or update.
        """
        materials_data = data.get('works_materials')
        materials_set = set()

        for material_data in materials_data:
            material = material_data.get('material')

            if not material:
                raise serializers.ValidationError(
                    'Material not specified'
                )

            material_tuple = (material.id)
            if material_tuple in materials_set:
                raise serializers.ValidationError(
                    'You cannot add two identical materials to a work'
                )
            materials_set.add(material_tuple)

        return data

    def create(self, validated_data):
        """Creates a new work."""

        materials_data = validated_data.pop('works_materials', [])
        tags_data = validated_data.pop('tags', [])
        image_data = validated_data.pop('image', [])
        if not validated_data.get('author'):
            raise serializers.ValidationError(
                'Author not specified'
            )

        # Create a work object
        work = Work.objects.create(**validated_data)
        work.tags.set(tags_data)  # Set tags

        for image in image_data:
            file = image.get('image')
            if file:
                # Generate a unique name for the image
                unique_id = uuid.uuid4()
                ext = file.name.split('.')[-1] if file.name else 'jpg'
                fname = f"uploaded_image_{unique_id}.{ext}"

                try:
                    image_instance = Image.objects.create(
                        work=work, image=ContentFile(file.file.read(),
                                                     name=fname))
                    print(image_instance)
                except Exception as e:
                    logger.exception(e)
                    raise serializers.ValidationError(
                        'Error creating image'
                    )

        if "video" in validated_data:
            timestamp = datetime.now().strftime('%Y_%m_%d_%H_%M_%S_%f')
            fname = f"uploaded_video_{timestamp}.mp4"
            work.video.save(fname, validated_data["video"].file)

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
        """Updates an existing work."""

        tags = validated_data.pop('tags')
        materials = validated_data.pop('works_materials')
        image_data = validated_data.pop('image', [])
        validated_data.pop('author', None)
        instance.image_set.all().delete()

        for image in image_data:
            file = image.get('image')
            if file:
                unique_id = uuid.uuid4()
                ext = file.name.split('.')[-1] if file.name else 'jpg'
                fname = f"uploaded_image_{unique_id}.{ext}"

                try:
                    image_instance = Image.objects.create(
                        work=instance, image=ContentFile(file.file.read(),
                                                         name=fname))
                    print(image_instance)
                except Exception as e:
                    logger.exception(e)
                    raise serializers.ValidationError(
                        'Error creating image'
                    )
        WorksMaterials.objects.filter(work=instance).delete()
        instance.tags.set(tags)
        self.get_materials(instance, materials)
        return super().update(instance, validated_data)

    def get_materials(self, work, materials_data):
        """Gets materials for a work."""

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
        Convert Work model instance to serialized data.
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
    author = UserSerializer1(read_only=True)
    materials = MaterialWorkserializer(
        many=True, read_only=True, source='works_materials')
    is_favorited = serializers.SerializerMethodField()
    image = WorksImageSerializer(
        source='image_set', required=False, read_only=True, many=True)
    video = Base64FileField(required=False)

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
