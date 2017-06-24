import Socket = SocketIO.Socket;
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject, ConnectableObservable} from 'rxjs/Rx';
import * as chalk from 'chalk';
import * as fs from 'fs';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/take';
import {STORAGE_PATH, STORAGE_SLIDES_FOLDER, SERVER_STORAGE_PATH} from '../commons/config';

type SnapshotStatus = 'no-updates' | 'new-available' | 'fetch-pending';

interface LiveLecture {
  socket: Socket,
  snapshotStatus: SnapshotStatus,
  slidePath$: Observable<string>
}

class LiveLectureService {

  // TODO for each lesson
  // 1. The last image available (url)
  // 2. Boolean setted by the raspberry to say if there is a new image ready to download
  // 3. Observable
  liveLectures: {[lessionId: string]: LiveLecture} = {};


  registerLecture(socket: Socket, lectureId: string): void {
    if (!this.liveLectures[lectureId]) {
      // TODO save lecture in db and check if already exists

      const lectureStorageUrl = `${STORAGE_PATH}/${lectureId}`;
      if (!fs.existsSync(lectureStorageUrl)) {
        fs.mkdirSync(lectureStorageUrl);
      }
      const lectureSlidesStorageUrl = `${lectureStorageUrl}/${STORAGE_SLIDES_FOLDER}`;
      if (!fs.existsSync(lectureSlidesStorageUrl)) {
        fs.mkdirSync(lectureSlidesStorageUrl);
      }


      const subject = new BehaviorSubject(null);
      let snapshotCounter = 0;

      socket.on('new-snapshot-available', (data) => {
        console.log(chalk.bold.blue(`New snapshot available for lecture ${lectureId}`));
        this.liveLectures[lectureId].snapshotStatus = 'new-available';
      });

      socket.on('send-snapshot', (data) => {

        snapshotCounter++;
        console.log(chalk.bold.blue(`Save snapshot data for lecture ${lectureId} - counter ${snapshotCounter}`));

        const snapshotFile = `${snapshotCounter}.png`;
        const snapshotStorageUrl = `${lectureSlidesStorageUrl}/${snapshotFile}`;

        fs.writeFile(snapshotStorageUrl, data, 'base64', err => {
          if (err) {
            console.error(err);
          } else {
            this.liveLectures[lectureId].snapshotStatus = 'no-updates';
            subject.next(`${SERVER_STORAGE_PATH}/${lectureId}/${STORAGE_SLIDES_FOLDER}/${snapshotFile}`);
          }
        });
      });

      socket.on('disconnect', err => {
        console.log(chalk.bold.blue(`${lectureId} Disconnected.` + err));
        subject.complete();
        delete this.liveLectures[lectureId];
      });

      this.liveLectures[lectureId] = {
        socket: socket,
        snapshotStatus: 'no-updates',
        slidePath$: subject.asObservable()
      }
    }
  }

  getNextSnapshot(lectureId: string): Observable<string> {
    // TODO decide if trigger new snapshot request based on snapshot[lId].newDownloadableImageBoolean

    if (this.liveLectures[lectureId]) {
      const liveLecture = this.liveLectures[lectureId];
      switch (liveLecture.snapshotStatus) {

        case 'no-updates':
          console.log(chalk.blue('> [Get Snapshot] No updates'));
          // Send latest snapshot available
          return liveLecture.slidePath$.take(1);
        case 'new-available':
          console.log(chalk.blue('> [Get Snapshot] New snapshot available'));
          // Fetch the latest snapshot and wait for it
          liveLecture.snapshotStatus = 'fetch-pending';
          liveLecture.socket.emit('get-snapshot');
          return liveLecture.slidePath$.skip(1).take(1);
        case 'fetch-pending':
          console.log(chalk.blue('> [Get Snapshot] fetch pending'));
          // Wait for latest snapshot fetch
          return liveLecture.slidePath$.skip(1).take(1);
      }
    } else {
      // TODO lecture not exists
      return Observable.throw('lecture not exists');
    }
  }
}

const service = new LiveLectureService();

export {service as LiveLectureService};
