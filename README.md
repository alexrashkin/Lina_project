# Проект «Портфолио художника»
# Описание
На этом сайте заказчик (профессиональный художник) может публиковать и редактировать свои работы (для каждой работы указывать название, тег (категорию, к которой относится конкретная работа), использованные материалы, описание, добавлять фото и/или видео в неограниченном количестве). 

Посетители сайта могут просматривать работы художника и страницу с основной информацией о художнике. Имеют возможность фильтровать работы художника по тегам.

Стек: Python3, Django3, Django REST framework, JavaScript, React, CSS, PostgreSQL, Gunicorn, Nginx, Docker.

Веб-продукт адаптирован под различные устройства (мобильные телефоны, планшеты, ПК)

Ссылка на Телеграм так же адаптивна (на ПК автоматически открывается веб-версия, а на телефоне мобильная версия).

Проект развёрнут на удалённом сервере с применением CI&CD и доступен по доменному имени https://angelina-art.ru/

# Как запустить проект:

Клонировать репозиторий и перейти в него в командной строке:

```
git clone git@github.com:alexrashkin/Lina_project.git
cd Lina_project
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
    source env/Scripts/activate
    ```

```
python3 -m pip install --upgrade pip
```

Установить зависимости из файла requirements.txt:

```
pip3 install -r requirements.txt
```

Выполнить миграции:

```
python3 manage.py migrate
```

Запустить проект:

```
python3 manage.py runserver
```

Автор проекта и разработчик:  
Александр Рашкин
https://github.com/alexrashkin