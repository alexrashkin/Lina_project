from django.core.management import BaseCommand
from works.models import Tag


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        data = [
            {'name': 'Картины', 'color': '#d3b389', 'slug': 'paintings'},
            {'name': 'Стены', 'color': '#d3b389', 'slug': 'walls'},
            {'name': 'Предметы интерьера', 'color': '#d3b389',
             'slug': 'interior_items'}]
        Tag.objects.bulk_create(Tag(**tag) for tag in data)
        self.stdout.write(self.style.SUCCESS('Теги успешно загружены!'))
