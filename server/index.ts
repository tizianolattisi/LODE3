#!/usr/bin/env node

import express = require('express');
import bodyParser = require( 'body-parser');
import compression = require( 'compression');
import morgan = require( 'morgan');
import expressJwt = require( 'express-jwt');
import mongoose = require( 'mongoose');
import http = require( 'http');
import socketio = require( 'socket.io');
import socketioJwt = require( 'socketio-jwt');
import nunjucks = require( 'nunjucks');
import config = require( './commons/config');
import {
    serverErrorHandler, notAuthorizedErrorHandler, notFoundErrorHandler,
    badRequestErrorHandler
} from "./routes/errorHandlers";
import {userRouterPublic, userRouter} from "./routes/api/user";
import {pdfRouter} from "./routes/api/pdf";
import {JWT_SECRET} from "./commons/config";
import {ioListener} from "./socket/socket";
import {courseRouter} from "./routes/api/course";
import {entrypointRouterPublic} from "./routes/entrypoint";
import {INDEX_HTML_NAME} from "./commons/config";

/* -----
 * Database connection
 ----- */

console.log("Connect to DB: " + config.DATABASE_URL);
mongoose.connect(config.DATABASE_URL);

// set mongoose promise library
mongoose.Promise = <any>global.Promise;

/* -----
 * Setup server application
 ----- */

const app = express();

// configure nunjucks template engine
nunjucks.configure(__dirname + '/../client/dist', {
    autoescape: true,
    express: app
});

// unprotected paths
const unprotectedPaths: string[] = [];
unprotectedPaths.push('/*');
unprotectedPaths.push('/api');
for (var layer of (<any>userRouterPublic).stack) {
    unprotectedPaths.push('/api' + layer.route.path);
}
for (var layer of (<any>entrypointRouterPublic).stack) {
    unprotectedPaths.push(layer.route.path);
}

// set express middleware
app.use('/api', morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());
app.use('/api', expressJwt({secret: config.JWT_SECRET}).unless({path: unprotectedPaths}));

/* -----
 * Routes
 ----- */

/* Serve static files (Angular 2 App) */
app.use('/', express.static(__dirname + '/../client'));
app.use('/', express.static(__dirname + '/../client/node_modules'));
app.use('/', express.static(__dirname + '/../client/dist'));

/* API routes */
app.get('/api', (req, res) => {
    res.json({message: 'Welcome'});
});

app.use('/', entrypointRouterPublic);
app.use('/api', userRouter);
app.use('/api', userRouterPublic);
app.use('/api', pdfRouter);
app.use('/api', courseRouter);


/* Last route for static files -> if requested path not match any route, index.html is served */
app.use('/*', (req, res) => {
    return res.render(INDEX_HTML_NAME, {});
});

/* Error Handlers Middleware */
app.use(notFoundErrorHandler);
app.use(notAuthorizedErrorHandler);
app.use(badRequestErrorHandler);
app.use(serverErrorHandler);

/* -----
 * Start Server
 ----- */

const port: number = parseInt(process.env['PORT']) || 8080;

const server = http.createServer(app as any);
server.listen(port, () => {
    const {address, port} = server.address();
    console.log("Http Server listening on " + address + ":" + port);
});

// start socket.io
const io = socketio.listen(server, {path: '/api/annotations'});

io.sockets
    .on('connection', socketioJwt.authorize({
        secret: JWT_SECRET,
        callback: 15000 // disconnect after 15s if client doesn't authenticate itself
    }))
    .on('authenticated', ioListener);