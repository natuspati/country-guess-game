FROM python:3.10-alpine
LABEL authors="nurlat"

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV HOME=/app

RUN mkdir $HOME
RUN mkdir $HOME/staticfiles

WORKDIR $HOME

RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev libmagic

COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
