# Generated by Django 3.2.3 on 2024-07-21 13:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Material',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название материала')),
            ],
            options={
                'verbose_name': 'Материал',
                'verbose_name_plural': 'Материалы',
            },
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True, verbose_name='Название тега')),
                ('color', models.CharField(max_length=7, verbose_name='Цветовой HEX-код')),
                ('slug', models.SlugField(unique=True, verbose_name='Уникальный слаг')),
            ],
            options={
                'verbose_name': 'Тег',
                'verbose_name_plural': 'Теги',
            },
        ),
        migrations.CreateModel(
            name='Work',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150, verbose_name='Название')),
                ('video', models.FileField(blank=True, null=True, upload_to='works/videos/', verbose_name='Видео')),
                ('text', models.TextField(verbose_name='Описание')),
                ('pub_date', models.DateTimeField(auto_now_add=True, verbose_name='Дата публикации')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='works', to=settings.AUTH_USER_MODEL, verbose_name='Автор публикации')),
                ('tags', models.ManyToManyField(to='works.Tag', verbose_name='Список тегов')),
            ],
            options={
                'verbose_name': 'Работа',
                'verbose_name_plural': 'Работы',
                'ordering': ('-pub_date',),
            },
        ),
        migrations.CreateModel(
            name='WorksMaterials',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('material', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='used_in_works', to='works.material')),
                ('work', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='works_materials', to='works.work')),
            ],
            options={
                'verbose_name': 'Материал в работе',
                'verbose_name_plural': 'Материалы в работах',
            },
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='works/images/', verbose_name='Изображение')),
                ('work', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='image_set', to='works.work')),
            ],
            options={
                'verbose_name': 'Изображение',
                'verbose_name_plural': 'Изображения',
            },
        ),
        migrations.CreateModel(
            name='Favorite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
                ('work', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorites', to='works.work', verbose_name='Работа')),
            ],
            options={
                'verbose_name': 'Избранная работа',
                'verbose_name_plural': 'Избранные работы',
            },
        ),
        migrations.AddConstraint(
            model_name='favorite',
            constraint=models.UniqueConstraint(fields=('user', 'work'), name='unique_favorite'),
        ),
    ]
