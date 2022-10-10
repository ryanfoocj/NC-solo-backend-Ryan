# Northcoders News API

After cloning this repo, you need to create environment variables using dotenv in order to ensure that anyone else who clones this will not have access to your local database. As such, create 2 new files called '.env.development' and '.env.test' in order to connect development and test environment variables locally in your repo. Afterwards, ensure that the .gitignore file has '.env.\*' included so that git will not push the 2 .env files during commits.

_This code goes into the .env.development file_

```
PGDATABASE=nc_news
```

_This code goes into the .env.test file_

```
PGDATABASE=nc_news_test
```
