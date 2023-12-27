import csv
import os

from django.core.management.base import BaseCommand
from django.db import transaction
from works.models import Material


class Command(BaseCommand):

    @transaction.atomic
    def handle(self, *args, **options):
        file_dir = '/home/sanya/Lina_project/lina-project-react/backend' 

        if not os.path.exists(file_dir):
            file_dir = '/app/'

        with open(os.path.join(file_dir, 'materials.csv'),
                  'r', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            next(reader)
            for row in reader:
                if len(row) == 1:
                    name = row[0]
                    created = Material.objects.get_or_create(
                        name=name,
                    )
                    if created:
                        message = (
                            f'Created material: {name}'
                        )
                    else:
                        message = (
                            f'Material already exists: {name}'
                        )
                    self.stdout.write(self.style.SUCCESS(message))
