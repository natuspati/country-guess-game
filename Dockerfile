FROM python:3.10-alpine
LABEL authors="nurlat"

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV HOME=/app

RUN mkdir $HOME

WORKDIR $HOME

RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev libmagic

COPY requirements.txt $HOME/requirements.txt
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Create staticfiles and log directories
RUN mkdir $HOME/staticfiles \
    && mkdir /var/log/nginx && touch /var/log/nginx/error.log \
    && mkdir /var/log/gunicorn && touch /var/log/gunicorn/error.log \
    && mkdir /var/log/django && touch /var/log/django/django.log

COPY . .
