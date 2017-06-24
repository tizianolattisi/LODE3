import {LiveLectureService} from '../services/live.lecture.service';
import Socket = SocketIO.Socket;
import * as chalk from 'chalk';

const socketListener = (socket: Socket) => {

  // const userId: string = (socket as any).decoded_token.id; // TODO enable?
  const lectureId: string = null;

  socket.on('register-lecture', (data) => {
    // TODO create a new lecture or open an existent one
    console.log(chalk.bold.blue(`> Register lecture "${data.id}"`))
    LiveLectureService.registerLecture(socket, data.id);
  });
}

export {socketListener as LectureSocketListener};
