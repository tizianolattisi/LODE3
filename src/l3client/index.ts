import * as io from 'socket.io-client';
import Socket = SocketIOClient.Socket;
import * as fs from 'fs';


let currentSlide = '/home/andrea/Desktop/' + getRandomInt(1, 3) + '.png';

const host = 'http://127.0.0.1:8080';
console.log('> Connecting to ' + host);
// const socket = io.connect(host, {path: '/api/lecturee'});
const socket = io.connect(host + '/api/lecture');

socket.on('disconnect', data => {
  console.log('Socket disconnected', data);
});

socket.on('connect', () => {
  console.log('> Connected');
  socket.emit('authenticate', {token: '123'});

  console.log('> Register lecture');
  socket.emit('register-lecture', {id: 'lecture1'});

});

socket.on('authenticated', () => { // TODO is it right? is this event emitted?
  console.log('> Register lecture');
  socket.emit('register-lecture', {id: 'lecture1'});
});

process.on('exit', disconnect.bind(null, socket));
process.on('SIGINT', disconnect.bind(null, socket));
// process.on('uncaughtException', disconnect.bind(null, socket));


//////////////////////////////////////////////////////////////////////////////////////////

setInterval(() => {
  socket.emit('new-snapshot-available', {});
  currentSlide = '/home/andrea/Desktop/' + getRandomInt(1, 3) + '.png';
  console.log('> Snapshot changed: ' + currentSlide);
}, 15000);


socket.on('get-snapshot', data => {
  console.log('> Get snapshot');
  fs.readFile(currentSlide, (err, buffer) => {
    if (err) {
      console.error(err);
    } else {
      console.log('> Send snapshot: ' + currentSlide);
      socket.emit('send-snapshot', buffer.toString('base64'));
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
