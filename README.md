<p align="center">
	<img src="https://img.shields.io/github/license/monquess/monquess-calendar?color=FFBB94" alt="license">
	<img src="https://img.shields.io/github/last-commit/monquess/monquess-calendar?color=A33757" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/monquess/monquess-calendar?color=A33757" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/monquess/monquess-calendar?color=A33757" alt="repo-language-count">
<p>

---

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff" />
  <img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=%2361DAFB" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white" />
  <img src="https://img.shields.io/badge/Mantine-339AF0?logo=mantine&logoColor=fff" />
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff" />
  <img src="https://img.shields.io/badge/Nest.js-E0234E?logo=nestjs&logoColor=fff" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=fff" />
  <img src="https://img.shields.io/badge/Postgres-316192?logo=postgresql&logoColor=fff" />
  <img src="https://img.shields.io/badge/Passport-34E27A?logo=passport&logoColor=fff" />
  <img src="https://img.shields.io/badge/Amazon_S3-232F3E?logo=amazonwebservices&logoColor=fff" />
  <img src="https://img.shields.io/badge/OpenAPI-6BA539?logo=openapiinitiative&logoColor=fff" />    
  <img src="https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=fff" />
  <img src="https://img.shields.io/badge/Redis-DD0031?logo=redis&logoColor=fff" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff" />
</div>

# 🗓️ monquess-calendar

---

An advanced and elegant calendar application, built with NestJS and React

## Table of Contents

- [Project setup](#project-setup)
  - [Dependencies](#dependencies)
  - [Starting the server](#starting-the-server)
    - [Installation](#installation)
    - [Database setup](#database-setup)
    - [Running the server](#running-the-server)
  - [Starting the client](#starting-the-client)
- [API Documentation](#api-documentation)
- [License](#license)

## Project setup

### Dependencies

The project relies on the following technologies:

- [Node.js](https://nodejs.org/en) v18.8 or higher.
- [PostgreSQL](https://www.postgresql.org) v9.6 or higher.
- [Redis](https://redis.io) v2.6 or higher

### Starting the server

#### Installation

Clone the project repository to your local machine

```bash
$ git clone https://github.com/monquess/monquess-calendar.git
```

Go to the project directory

```bash
$ cd monquess-calendar/
```

Navigate to the backend directory

```bash
$ cd backend/
```

Copy the example .env file and fill in any necessary values

```bash
$ cp .env.example .env
```

Install project dependencies

```bash
$ npm ci
```

#### Database setup

Migrate the database and generate the Prisma client

```bash
$ npx prisma migrate dev
```

Seed the database if required

```bash
$ npx prisma db seed
```

Once the database is seeded, you can log in with any user email and the default password `password`.

#### Running the server

To run the application locally, you'll need to start the server using the following command

```bash
$ npm run start
```

Alternatively you can run app container in Docker

```bash
$ docker build -t <image name>
$ docker run -p 3000:3000 --name <container-name> <image-name>
```

or with Docker Compose

```bash
$ docker-compose up -d
```

> [!NOTE]
> Make sure you have [Docker](https://www.docker.com) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.

### Starting the client

Navigate to the backend directory

```bash
$ cd frontend/
```

Copy the example .env file and fill in any necessary values

```bash
$ cp .env.example .env
```

Run the client application using the following command

```bash
$ npm run dev
```

Once the client has started successfully, the apllication will be accessible at http://localhost:4200 or on another port specified in the _.env_ file

## API documentation

<!-- The complete API reference can be accessed on [SwaggerHub](https://app.swaggerhub.com/apis-docs/EGORKOVTUN8/bug-talk_api/1.0). -->

If the server is running locally, you can view the documentation at http://localhost:3000/api/docs. This URL provides access to the API endpoints and methods directly from your server environment, allowing you to test and interact with the API in real-time.

> [!NOTE]
> The port in documentation url can be different if you specified other in environment variables.

## License

Project is licensed under [MIT License](LICENSE).
