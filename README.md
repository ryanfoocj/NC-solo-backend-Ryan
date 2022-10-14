# Northcoders News API

Link to the API: https://news-api-ryanfoo.herokuapp.com/api

## Introduction

The Northcoders News API is a RESTful backend application that utilises a _PostgreSQL_ database hosted on Heroku to store information regarding news articles, their topics, readers, comments and their users. Users are able to send requests to the API which utilises _Express.js's_ framework and middleware functions to handle them and communicate with the database in order to retrieve, update, create or delete information. Integration of the API and its features were tested using _jest_ and _supertest_ in order to build up functionality while ensuring the controllers and models communicate without conflicts.

Technologies used:

1. Express.js
2. PostgreSQL
3. Heroku
4. Husky
5. dotenv
6. jest
7. supertest

# Getting Started

Once you have cloned this repo, you will need to install the following dependencies. The minimum version of Node needed to run this project is **v18.8.0** while PostgreSQL would need to be **v8.8.0**.

Express:

```
$ npm install express
```

PostgresQL:

```
$ npm install pg
```

After cloning this repo, you need to create environment variables using dotenv in order to ensure that anyone else who clones this will not have access to your local database. As such, create 2 new files called '.env.development' and '.env.test' in order to connect development and test environment variables locally in your repo. Afterwards, ensure that the .gitignore file has '.env.\*' included so that git will not push the 2 .env files during commits.

_This code goes into the .env.development file_

```
PGDATABASE=nc_news
```

_This code goes into the .env.test file_

```
PGDATABASE=nc_news_test
```
