# Express API to Whitelist Website

## Description
This is very simple API to whitelist website which i crated recently. I'am not really into backend and this is one of the first attempts into this. If you find any bug just open a issue in repo. Thanks in advance.

## Dependiences
```
body-parser
cors
discord.js
dompurify
dotenv
express
helmet
jsdom
jsonwebtoken
morgan
mysql2
```

## DOTENV
This is what your .env file should contain
```
PORT=3000
clientId=CLIENTID_OF_OAUTH2_APP
clientSecret=CLIENT_SECRET_OF_OAUTH2_APP
dbHost=DB_HOST_IP
dbUser=DB_USER
dbPassword=DB_PASSWORD
dbName=DB_DATABASE_NAME
TOKEN_SECRET=RANDOM_KEY
TOKEN=DISCORD_BOT_TOKEN
```

## Setup
```
npm install
```

## Lint

```
npm run lint
```

## Test

```
npm run test
```

## Development

```
npm run dev
```
