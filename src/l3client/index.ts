import * as io from 'socket.io-client';
import Socket = SocketIOClient.Socket;
import * as fs from 'fs';
import * as path from 'path';


// //////////////////////////////////////
//  Socket events
// //////////////////////////////////////

const LectureSocketEvents = {
  Client: {
    REGISTER_LECTURE: 'register-lecture', // Il raspberry registra una nuova lezione "live" presso il server
    START_LECTURE: 'start-lecture', // Il raspberry inizia la lezione
    NEW_SCREENSHOT_AVAILABLE: 'new-screenshot-available', // Un nuovo screenshot e' disponibile al download
    SEND_SCREENSHOT: 'send-screenshot', // Il raspberry invia lo screenshot attuale (l'ultimo catturato) al server
    STOP_LECTURE: 'stop-lecture' // Il raspberry termina la lezione
  },
  Server: {
    GET_SCREENSHOT: 'get-screenshot' // Il server richiede l'ultimo screenshot catturato dal raspberry
  }
};


let currentSlide = path.resolve(__dirname, `../../img/${getRandomInt(1, 3)}.png`);
let slideTimestamp = new Date().getTime();


// 1) Connessione al server /////////////////////////////////////////////

const host = 'http://127.0.0.1:8080';
console.log('> Connecting to ' + host);
// const socket = io.connect(host, {path: '/api/lecture'});
const socket = io.connect(host + '/api/lecture');

socket

  .on('disconnect', data => {
    console.log('Socket disconnected', data);
  })

  .on('unauthorized', function (msg) {
    console.log('Unauthorized: ' + JSON.stringify(msg.data));
    throw new Error(msg.data.type);
  })

  .on('connect', () => {
    // 2) Il raspberry e' connesso e deve autenticarsi con il jwt token /////////////////////////////////////////////

    console.log('> Connected');
    socket.emit('authenticate', {
      // tslint:disable-next-line:max-line-length
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxvZGVAdW5pdG4uaXQiLCJ0eXBlIjoicHJvZmVzc29yIiwiaWF0IjoxNTA1Njc0MTg3fQ._9O8kKQAkvapWd1YKHK4HB6Nfr-lO1Fmo2mbHo0IIIw`
    });

  })


  // Start lecture
  .on('authenticated', () => {

    // 3) Il raspberry e' autenticato e puo' registrare una nuova lezione presso il server /////////////////////////////////////////////

    console.log('> Authenticated!');
    console.log('> Register lecture');


    // TODO do when socket is authenticated -> obtains more info...
    socket.emit(LectureSocketEvents.Client.REGISTER_LECTURE, {
      pin: '1234',
      name: 'Lesson' // Opzionale
    });

    setTimeout(() => {
      // 4) Una volta registrata la lezione e' possibile iniziarla con l'evento 'start-lecture' /////////////////////////////////
      console.log('> Start lecture');
      socket.emit(LectureSocketEvents.Client.START_LECTURE);
    }, 1000);
  });



//////////////////////////////////////////////////////////////////////////////////////////

setInterval(() => {

  // 5) Ogni volta che un nuovo screenshot e' disponibile -> invia al server l'evento 'new-screenshot-available' ////////////

  currentSlide = path.resolve(__dirname, `../../img/${getRandomInt(1, 3)}.png`);
  slideTimestamp = new Date().getTime();
  // Inform server about current slide changed
  socket.emit(LectureSocketEvents.Client.NEW_SCREENSHOT_AVAILABLE);
  console.log('> Screenshot changed: ' + currentSlide);
}, 5000);

// 6) Quando il server richiede uno screenshot -> invia al server lo screenshot e il suo timestamp /////////////////////

// Server request for last slide
socket.on(LectureSocketEvents.Server.GET_SCREENSHOT, data => {

  console.log('> [Server] Get Screenshot');
  fs.readFile(currentSlide, (err, buffer) => {
    if (err) {
      console.error(err);
    } else {
      // Send slide to server
      console.log('> Send Screenshot: ' + currentSlide);
      socket.emit(LectureSocketEvents.Client.SEND_SCREENSHOT,
        {
          image: buffer.toString('base64'), // Lo screenshot in "base64"
          timestamp: slideTimestamp, // Il timestamp legato allo screenshot
          name: 'Screenshot 1' // Opzionale, il nome dello screenshot
        }
      );
    }
  });
})


//////////////////////////////////////////////////////////////////////////////////////////

process.on('exit', disconnect.bind(null, socket));
process.on('SIGINT', disconnect.bind(null, socket));

function disconnect(s: Socket) {
  console.log('> Disconnect');
  s.disconnect();
  s.close();
  process.exit();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
