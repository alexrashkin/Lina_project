#!/bin/bash
source ../.venv/bin/activate
env ALLOWED_HOSTS=localhost python3 manage.py runserver localhost:8000