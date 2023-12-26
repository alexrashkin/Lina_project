# Проект «Lina-project»
# Описание
На этом сайте пользователи могут...

Стек: Python3, Django3, Django REST framework, React, PostgreSQL, gunicorn, nginx, Яндекс.Облако

Проект доступен по доменному имени https://lina-project.myvnc.com

# Как запустить проект:

Клонировать репозиторий и перейти в него в командной строке:

```
git clone https://github.com/alexrashkin/lina-project-react.git
cd lina-project-react
```

Cоздать и активировать виртуальное окружение:

```
python3 -m venv env
```

* Если у вас Linux/macOS

    ```
    source env/bin/activate
    ```

* Если у вас Windows

    ```
    source env/scripts/activate
    ```

```
python3 -m pip install --upgrade pip
```

Установить зависимости из файла requirements.txt:

```
pip install -r requirements.txt
```

Выполнить миграции:

```
python3 manage.py migrate
```

Запустить проект:

```
python3 manage.py runserver
```
