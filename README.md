# Lode3


## Build

Install npm dependencies with `npm install`.

Use the following npm scripts to build the whole application:

``` bash
$ npm run server:build:prod 
$ npm run client:build:prod 
```
The commands will generate the *dist* folder that will contains the compiled client and server.

Use `npm start` to start the server.

Before starting the server, some environment variables must be setted:

|ENVIRONMENT VARIABLE| DESCRIPTION                           |
|--------------------|---------------------------------------|
| SERVER_PORT        | Server's port                         |
| JWT_SECRET         | JWT secret string                     |
| DB_URL             | Url of a mongo database (eg. "mongodb://localhost:27017/") (mandatory) |
| DB_NAME            | Database name (mandatory)            |
| STORAGE_PATH       | Path where lesson's slides are stored |
| SENDGRID_API_KEY   | Sendgrid API Key (mandatory)          |


## Development

To develop the server it is possible to run the following commands:

```bash
# Build the server and keep looking for code changes
$ npm run server:build:w 
# Start the server and restart it whenever the code changes
$ npm run server:start:w 
```

To develop the client it is possible to run the following commands:

```bash
# Build the client, look for changes, start a simple server that serves
# client files and redirect the API requests to the main server on port 8080 
# (the server must be already running) 
$ npm run client:serve
```
