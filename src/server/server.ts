import * as express from 'express';
import * as morgan from 'morgan';
import * as chalk from 'chalk';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as expressJwt from 'express-jwt';
import * as http from 'http';
import * as socketIO from 'socket.io';
import * as socketIOJwt from 'socketio-jwt';
import {UserRouter, PUBLIC_USER_PATHS} from './api/user.router';
import {LectureRouter} from './api/lecture.router';
import {AnnotationSocketListener} from './sockets/annotation.socket';
import {LectureSocketListener} from './sockets/lecture.socket';
import {IUser} from './models/db/User';
import {
  JWT_SECRET,
  SERVER_PORT,
  SOCKET_AUTH_TIMEOUT,
  SERVER_API_PATH,
  STORAGE_PATH,
  SERVER_STORAGE_PATH
} from './commons/config';
import {
  NotFoundErrorHandler,
  ServerErrorHandler,
  BadRequestErrorHandler,
  NotAuthorizedErrorHandler
} from './api/error.handlers.router';
import * as jwt from 'jsonwebtoken'; // TODO remove


const CLIENT_APP_FS_PATH = `${__dirname}/../client`;

export default class Server {

  // Express app
  private app: express.Application;

  private authorizationMiddleware;

  private unprotectedPaths = {
    path: [
      '/*',
      SERVER_API_PATH,
      ...PUBLIC_USER_PATHS
      // TODO complete
    ]
  };

  constructor() {
    console.log('L3 token ', jwt.sign({
      email: 'lode@unitn.it',
      type: 'professor'
    } as IUser, JWT_SECRET, {}));

    this.app = express();
    this.authorizationMiddleware = expressJwt({secret: JWT_SECRET}).unless(this.unprotectedPaths);

    this.setupMiddleware();
    this.setupApi();
    this.setupStatic();
  }

  private setupMiddleware() {
    this.app.use(SERVER_API_PATH, morgan('dev'));
    this.app.use(compression());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
  }

  private setupApi(): void {
    // Setup API auth middleware
    // this.app.use(SERVER_API_PATH, this.authorizationMiddleware);

    // Setup API paths
    this.app.get(SERVER_API_PATH, (req, res) => res.json({message: 'Hello!'}));

    this.app.use(SERVER_API_PATH, UserRouter);
    this.app.use(SERVER_API_PATH, this.authorizationMiddleware, LectureRouter);

    // Setup error handlers
    this.app.use(SERVER_API_PATH, NotFoundErrorHandler);
    this.app.use(SERVER_API_PATH, NotAuthorizedErrorHandler);
    this.app.use(SERVER_API_PATH, BadRequestErrorHandler);
    this.app.use(SERVER_API_PATH, ServerErrorHandler);
  }

  private setupStatic(): void {
    // Serve Client App
    this.app.use('/', express.static(CLIENT_APP_FS_PATH));
    // Serve Lode files
    this.app.use(SERVER_STORAGE_PATH, this.authorizationMiddleware, express.static(STORAGE_PATH),
      (req, res) => {
        res.sendStatus(501);
      }
    );

    // Any path -> serve index.html file
    this.app.get(/\/.*/, function (req, res) {
      res.sendFile('index.html', {root: CLIENT_APP_FS_PATH});
    });
  }

  public run() {

    // Create and run server
    const server = http.createServer(this.app);
    server.listen(SERVER_PORT, () => { // Listen only for local connections
      const {address, port} = server.address();
      console.log(chalk.bold.green(`> Http Server listening on ${address}:${port}`));
    });

    // Create and start socket

    const io = socketIO.listen(server);
    // User different namespaces for
    // 1. Socket used by annotation app
    // 2. Socket used by the Lode box
    const annotationIO = io.of('/api/annotation');
    const lectureIO = io.of('/api/lecture');

    // Setup auth on socket
    annotationIO.on('connection', socketIOJwt.authorize({
      secret: JWT_SECRET,
      timeout: SOCKET_AUTH_TIMEOUT
    }));

    lectureIO.on('connection', socketIOJwt.authorize({
      secret: JWT_SECRET,
      timeout: SOCKET_AUTH_TIMEOUT,
      callback: true
    }));

    annotationIO.on('authenticated', AnnotationSocketListener);

    lectureIO.on('authenticated', LectureSocketListener);

    return server;
  }
}




