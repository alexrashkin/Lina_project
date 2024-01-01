#!/bin/bash
source ../venv/bin/activate
env ALLOWED_HOSTS=localhost DEBUG=True MEDIA_ROOT=./media/ python3 manage.py runserver localhost:8000