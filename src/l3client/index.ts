import * as io from 'socket.io-client';
import Socket = SocketIOClient.Socket;
import * as fs from 'fs';


const LectureSocketEvents = {
  Client: {
    REGISTER_LECTURE: 'register-lecture',
    START_LECTURE: 'start-lecture',
    NEW_SCREENSHOT_AVAILABLE: 'new-screenshot-available',
    SEND_SCREENSHOT: 'send-screenshot',
    STOP_LECTURE: 'stop-lecture'
  },
  Server: {
    GET_SCREENSHOT: 'get-screenshot'
  }
};


let currentSlide = '/home/andrea/Desktop/' + getRandomInt(1, 3) + '.png';
let slideTimestamp = new Date().getTime();

// Connect
const host = 'http://127.0.0.1:8080';
console.log('> Connecting to ' + host);
// const socket = io.connect(host, {path: '/api/lecture'});
const socket = io.connect(host + '/api/lecture');

socket

  .on('disconnect', data => {
    console.log('Socket disconnected', data);
  })

  .on('unauthorized', function (msg) {
    console.log('unauthorized: ' + JSON.stringify(msg.data));
    throw new Error(msg.data.type);
  })

  .on('connect', () => {
    console.log('> Connected');

    // Auth
    console.log('Emit auth...');
    socket.emit('authenticate', {
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxvZGVAdW5pdG4uaXQiLCJ0eXBlIjoicHJvZmVzc29yIiwiaWF0IjoxNTAwNDkwMjAyfQ.gF1ur6reYSutHh5PBtq-01go74tsS6yJnzZ89i290HU`
    });

  })


  // Start lecture
  .on('authenticated', () => { // TODO with authentication -> register lecture to server only when authenticated
    // Start lecture
    console.log('> Authneticated!');
    console.log('> Register lecture');
    // TODO do when socket is authenticated -> obtains more info...
    socket.emit(LectureSocketEvents.Client.REGISTER_LECTURE, {
      pin: '1234',
      name: 'Lez1' // Opzionale
    });

    setTimeout(() => {
      console.log('> Start lecture');
      socket.emit(LectureSocketEvents.Client.START_LECTURE);
    }, 1000);
  });


process.on('exit', disconnect.bind(null, socket));
process.on('SIGINT', disconnect.bind(null, socket));
// process.on('uncaughtException', disconnect.bind(null, socket));


//////////////////////////////////////////////////////////////////////////////////////////

setInterval(() => {

  // Inform server about current slide changed
  socket.emit(LectureSocketEvents.Client.NEW_SCREENSHOT_AVAILABLE);
  currentSlide = '/home/andrea/Desktop/' + getRandomInt(1, 3) + '.png';
  slideTimestamp = new Date().getTime();
  console.log('> Screenshot changed: ' + currentSlide);
}, 15000);


// Server request for last slide
socket.on(LectureSocketEvents.Server.GET_SCREENSHOT, data => {
  console.log('> Get Screenshot');
  fs.readFile(currentSlide, (err, buffer) => {
    if (err) {
      console.error(err);
    } else {
      // Send slide to server
      console.log('> Send Screenshot: ' + currentSlide);
      socket.emit(LectureSocketEvents.Client.SEND_SCREENSHOT,
        {
          image: buffer.toString('base64'),
          timestamp: slideTimestamp,
          name: 'Screenshot 1' // Opzionale
        }
      );
    }
  });
})


//////////////////////////////////////////////////////////////////////////////////////////


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
