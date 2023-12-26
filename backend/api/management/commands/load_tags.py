from django.core.management import BaseCommand
from works.models import Tag


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        data = [
            {'name': 'Картины', 'color': '#FF5733', 'slug': 'breakfast'},
            {'name': 'Наушники', 'color': '#33FF57', 'slug': 'dinner'},
            {'name': 'Статуэтки', 'color': '#5733FF', 'slug': 'supper'}]
        Tag.objects.bulk_create(Tag(**tag) for tag in data)
        self.stdout.write(self.style.SUCCESS('Теги успешно загружены!'))
