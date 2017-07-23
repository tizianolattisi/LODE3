import {LiveLectureService} from '../services/live.lecture.service';
import Socket = SocketIO.Socket;
import * as chalk from 'chalk';
import * as uuidv4 from 'uuid/v4';
import {IUser} from '../models/db/User';

export const LectureSocketEvents = {
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


const socketListener = (socket: Socket) => {

  const user: IUser = (socket as any).decoded_token;

  // Check token belong to am authorized user
  if (user.type !== 'professor') {
    console.log('User cannot use this socket');
    socket.disconnect();
  }

  let lectureId: string = null;

  socket.on(LectureSocketEvents.Client.REGISTER_LECTURE, (data: {name?: string; pin: string}) => {
    // Create a new id
    lectureId = uuidv4();

    // TODO Check if lecture name is passed, otherwise generate it

    // register the lecture in the live lectures
    console.log(chalk.bold.blue(`> Register lecture "${lectureId}"`))
    LiveLectureService.registerLecture(lectureId, socket, data);
  });

  socket.on(LectureSocketEvents.Client.START_LECTURE, data => {
    if (lectureId) {
      console.log(chalk.green(`> Start lecture "${lectureId}"`))
      LiveLectureService.startLecture(lectureId);
    }
    // else {
    // TODO lecture is not registered... what to do?
    // }
  });

  socket.on(LectureSocketEvents.Client.NEW_SCREENSHOT_AVAILABLE, data => {
    if (lectureId) {
      console.log(chalk.blue(`> New screenshot available for lecture ${lectureId}`));
      LiveLectureService.newScreenshotAvailable(lectureId);
    }
  });

  socket.on(LectureSocketEvents.Client.SEND_SCREENSHOT, data => {
    if (lectureId) {
      console.log(chalk.bold.blue(`> Save screenshot data for lecture ${lectureId}`));
      LiveLectureService.saveScreenshot(lectureId, data);
    }
  });

  socket.on(LectureSocketEvents.Client.STOP_LECTURE, data => {
    if (lectureId) {
      console.log(chalk.red(`> Stop lecture "${lectureId}"`))
      LiveLectureService.stopLecture(lectureId);
    }
  });

  socket.on('disconnect', err => {
    console.log(chalk.bold.red(`Lecture ${lectureId} Disconnected.` + err));
    LiveLectureService.lectureDisconnected(lectureId);
  });

}

export {socketListener as LectureSocketListener};
