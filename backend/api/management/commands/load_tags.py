from django.core.management import BaseCommand
from works.models import Tag


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        data = [
            {'name': 'Картины', 'color': '#778899', 'slug': 'paintings'},
            {'name': 'Стены', 'color': '#778899', 'slug': 'walls'},
            {'name': 'Предметы интерьера', 'color': '#778899', 'slug': 'interior_items'}]
        Tag.objects.bulk_create(Tag(**tag) for tag in data)
        self.stdout.write(self.style.SUCCESS('Теги успешно загружены!'))
