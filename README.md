<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![LinkedIn][linkedin-shield]][linkedin-url]
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src=static/random_logo.png alt="Logo" width="200" >
  </a>

<h3 align="center">Guess a Country</h3>

  <p align="center">
    Demo for a game, where a user guesses a mystery country daily.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-game">About the Game</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
      <ul>
        <li><a href="#changes-to-front-end">Changes to Front-end</a></li>
        <li><a href="#changes-to-back-end">Changes to Back-end</a></li>
        <li><a href="#running-inside-docker-compose">Running inside Docker-compose</a></li>
      </ul>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About the Game

The project is inspired by [Worldle](https://worldle.teuteuf.fr/).

The aim is to guess a mysterious country.

* Capital is revealed first. Then, continent, population and flag are revealed.
* There are 4 guesses before the game ends in failure and the correct answer is shown.
* Guessing the answer correctly also reveals all details.
* Mystery country is changed daily at midnight based on the user's local time.
* No authentication is required, stats (game state, number of wins/losses) are tracked with a cookie.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

Back-end is built with Django and Django Rest Framework. Local or remote PostgreSQL database and Redis cache are spun up
inside Docker-compose.

Front-end is built with React and Bootstrap. OpenAPI Generator creates [`api_client`](api_client) according to
[OpenAPI 3.0](https://spec.openapis.org/oas/v3.1.0) specifications. React calls [`api_client`](api_client) without
direct
interactions with [CORS](https://pypi.org/project/django-cors-headers/)
and [axios](https://www.npmjs.com/package/axios).

* [![Django][django.com]][Django-url]
* [![Django Rest Framework][DjangoRestFrameWork.com]][DjangoRestFrameWork-url]
* [![React][React.js]][React-url]
* [![Webpack][Webpack.com]][Webpack-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![OpenAPIGenerator][OpenAPIGenerator.com]][OpenAPIGenerator-url]
* [![PostgreSQL][PostgreSQL.com]][PostgreSQL-url]
* [![Redis][Redis.com]][Redis-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->

## Getting Started

Simplest way to run the game locally is

* to use [`dev_local.py`](country_guess/settings/dev_local.py),
* not re-build front-end bundles: [`dev.js`](static/dev.js) and [`prod.js`](static/prod.js).

For a production-style workflow, `docker-compose` needs to build muli-container environments
for [`docker-compose.dev.yml`](docker-compose.dev.yml) or [`docker-compose.prod.yml`](docker-compose.prod.yml) settings.

To change front-end, the pipeline needs to be constructed, explained [below](#changes-to-front-end).

### Prerequisites

Make sure `npm` and `pip` are installed.

```sh
pip install --upgrade pip
npm install npm@latest -g
```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/natuspati/country-guess-game.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Install PIP packages
   ```sh
   pip install -r requirements.txt
   ```
4. Make migrations and load country data and run server.
   ```sh
   python manage.py makemigrations
   python manage.py migrate
   python manage.py loaddata static/country_data.json
   ```
5. Set settings to `dev_local.py` and run server
    ```sh
   python manage.py runserver 127.0.0.1:8000 --settings=country_guess.settings.dev_local
   ```
6. Visit http://127.0.0.1:8000/

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->

## Usage

Game flow is explained in [About the Game](#about-the-game). Here are some screenshots.

<p float="left">
  <img src=static/default.png alt="Default" width="200" >
  <img src=static/suggestions.png alt="Suggestions" width="200" >
  <img src=static/incorrect_guess.png alt="Incorrect guess" width="200" >
</p>
<p float="left">
  <img src=static/invalid_guess.png alt="Invalid Guess" width="200" >
  <img src=static/correct_guess.png alt="Correct guess" width="200" >
  <img src=static/no_guesses.png alt="No guesses left" width="200" >
</p>

### Changes to front-end

To make changes in the front-end, edit `fe` contents. To generate JS bundle, run

```sh
npm run dev
```

Webpack is installed to make a bundle. Configuration file is [`webpack.config.js`](webpack.config.js).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Changes to back-end

To make changes in the back-end logic (views, routing), edit [`api`](api) contents.

In that case, schema needs to be adjusted with `drf-spectacular` using the command

```sh
python manage.py spectacular --file schema.yml
```

Next, [`api_client`](api_client) needs to be re-generated
using [`typescript-fetch`](https://openapi-generator.tech/docs/generators/typescript-fetch) generator. Install it

```sh
npm install @openapitools/openapi-generator-cli -g
```

and update [`api_client`](api_client)

```sh
openapi-generator-cli generate -i schema.yml -g typescript-fetch -o ./api-client/
```

Typescript-fetch generator is chosen for comprehensive type hints and ease of `fetch` requests.

### Running inside Docker-compose

> **Warning**
> Docker and docker-compose must be installed. See here installation
> instructions: [Get Docker](https://docs.docker.com/get-docker/)

[`docker-compose.dev.yml`](docker-compose.dev.yml) runs with flushed PostgreSQL database, uses dummy cache and runs on
port `8000`.

[`docker-compose.prod.yml`](docker-compose.prod.yml) runs with PostgreSQL database, Redis cache. Gunicorn and Ngninx are
configured to expose port `80`.

Run the build command with dev configuration

```sh
docker-compose -f docker-compose.dev.yml up -d --build
```

Change `-f` value to [`docker-compose.prod.yml`](docker-compose.prod.yml) for production style.

To stop the containers, run

```shell
docker-compose -f docker-compose.dev.yml down -v
```

Remove dangling images and volumes to reduce used storage

```sh
docker image prune
docker volume prune
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [x] Write game logic using Django Rest Framework
- [x] Add Django's `Sessions` framework to track user stats
- [x] Configure front-end pipeline
- [x] Configure OpenAPI generated `api_client` to work with React front-end
- [x] Add tasks to update country data from [REST Countries](https://restcountries.com/) and reset `used_at` dates.
- [x] Add docker-compose configurations
- [ ] Complete behavior driven tests
- [ ] Add job scheduling with Celey
- [ ] Add distance indicator for incorrect guesses using a free Map API

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->

## License

Distributed under the MIT License. See [`LICENSE.txt`](LICENSE.txt) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->

## Contact

Nurlat Bekdullayev - [@natuspati](https://twitter.com/natuspati) - natuspati@gmail.com

Project Link: [https://github.com/natuspati/country-guess-game](https://github.com/natuspati/country-guess-game)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

Thanks to these resources that helped me to build the game.

* [Daniel and Audrey Greenfeld: Two Scoops of Django 3.x](https://www.feldroy.com/books/two-scoops-of-django-3-x)
* [Modern JavaScript for Django Developers](https://www.saaspegasus.com/guides/modern-javascript-for-django-developers/)
* [Michael Herman: Dockerizing Django with Postgres, Gunicorn, and Nginx](https://testdriven.io/blog/dockerizing-django-with-postgres-gunicorn-and-nginx/)
* [Lucas Miguel: PyTest with Django REST Framework: From Zero to Hero](https://dev.to/sherlockcodes/pytest-with-django-rest-framework-from-zero-to-hero-8c4)
* [Ryuchi Miyazaki: Deploying a Production-ready Django app on AWS](https://dev.to/rmiyazaki6499/deploying-a-production-ready-django-app-on-aws-1pk3#deployment-script)
* [Othneil Drew: Best-README-Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/natuspati/country-guess-game.svg?style=for-the-badge
[contributors-url]: https://github.com/natuspati/country-guess-game/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/natuspati/country-guess-game.svg?style=for-the-badge
[forks-url]: https://github.com/natuspati/country-guess-game/network/members
[stars-shield]: https://img.shields.io/github/stars/natuspati/country-guess-game.svg?style=for-the-badge
[stars-url]: https://github.com/natuspati/country-guess-game/stargazers
[issues-shield]: https://img.shields.io/github/issues/natuspati/country-guess-game.svg?style=for-the-badge
[issues-url]: https://github.com/natuspati/country-guess-game/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/nurlat/
[license-shield]: https://img.shields.io/github/license/natuspati/country-guess-game.svg?style=for-the-badge
[license-url]: https://github.com/natuspati/country-guess-game/blob/main/LICENSE.txt

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB

[React-url]: https://reactjs.org/

[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white

[Bootstrap-url]: https://getbootstrap.com

[Django.com]: https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white

[Django-url]: https://www.djangoproject.com/

[DjangoRestFramework.com]: https://img.shields.io/badge/DjangoRestFramework-A30000?style=for-the-badge&logoColor=white

[DjangoRestFramework-url]: https://www.django-rest-framework.org/

[OpenAPIGenerator.com]: https://img.shields.io/badge/OpenAPI_Generator-6BA539?style=for-the-badge&logo=openapiinitiative&logoColor=white

[OpenAPIGenerator-url]: https://openapi-generator.tech/

[Docker.com]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white

[Docker-url]: https://www.docker.com/

[Redis.com]: https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white

[Redis-url]: https://redis.io/

[PostgreSQL.com]: https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white

[PostgreSQL-url]: https://www.postgresql.org/

[Webpack.com]: https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=white

[Webpack-url]: https://webpack.js.org/
