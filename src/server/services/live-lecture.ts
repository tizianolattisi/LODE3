import Socket = SocketIO.Socket;
import {BehaviorSubject} from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Lecture} from '../models/db/Lecture';
import {STORAGE_PATH, STORAGE_SLIDES_FOLDER, SERVER_STORAGE_PATH} from '../commons/config';
import {LectureSocketEvents} from '../sockets/lecture.socket';
import * as chalk from 'chalk';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/take';


export type ScreenshotStatus = 'no-updates' | 'new-available' | 'fetch-pending';

export class LiveLecture {

  private lectureId: string;
  private socket: Socket;
  private started: boolean;
  private name: string;
  private pin: string;

  private screenshotStatus: ScreenshotStatus;
  private nextScreenshotId$: BehaviorSubject<string>;
  private nextScreenshotIdObs$: Observable<string>;

  private screenshotFolderUrl: string;


  constructor(lectureId: string, socket: Socket, pin: string, name?: string) {
    this.lectureId = lectureId;
    this.socket = socket;
    this.started = false;
    this.screenshotStatus = 'no-updates';
    this.pin = pin;

    if (!name) {
      // TODO generate a name
      this.name = 'Lezione';
    } else {
      this.name = name;
    }

    this.nextScreenshotId$ = new BehaviorSubject(null);
    this.nextScreenshotIdObs$ = this.nextScreenshotId$.asObservable();
  }


  startLecture() {
    this.started = true;

    // Save lecture in db
    const lecture = new Lecture();
    lecture.uuid = this.lectureId;
    lecture.course = ''; // TODO course name
    lecture.name = this.name;
    lecture.live = true;
    lecture.screenshots = [];

    lecture.save()
      .then(l => {

        // Create lecture folder
        this.screenshotFolderUrl = `${STORAGE_PATH}/${l.uuid}/${STORAGE_SLIDES_FOLDER}`;
        if (!fs.existsSync(this.screenshotFolderUrl)) {
          mkdirp.sync(this.screenshotFolderUrl);
        }

        // TODO emit "lecture is started" / or let do it to livelecturesservice
      })
      .catch(err => {
        console.error(err);
        // TODO what to do?
      });
  }

  newScreenshotAvailable() {
    this.screenshotStatus = 'new-available';
  }

  saveScreenshot(image: string, timestamp: number, name?: string) {

    const screenshotFile = `${timestamp}.png`; // TODO name
    const screenshotPath = `${this.screenshotFolderUrl}/${screenshotFile}`;

    fs.writeFile(screenshotPath, image, 'base64', err => {
      if (err) {
        console.error(err); // TODO handle error
      } else {
        const lectureScreenshot = {
          id: `${timestamp}`,
          name: name ? name : '',
          timestamp: timestamp
        };
        console.log('Save screenshot', lectureScreenshot);

        // Register screenshot in db
        Lecture.update({uuid: this.lectureId}, {$push: {screenshots: lectureScreenshot}})
          .then(res => {
            // Update next screenshot available
            this.screenshotStatus = 'no-updates';
            this.nextScreenshotId$.next(lectureScreenshot.id)
          })
          .catch(e => console.error(e)); // TODO handle error
      }
    });
  }

  stopLecture() {
    this.nextScreenshotId$.complete();
    Lecture.update({uuid: this.lectureId}, {live: false})
      .then(res => console.log('ok')) // TODO handle
      .catch(e => console.error(e)); // TODO handle error
  }

  lectureDisconnected() {
    this.stopLecture();
  }

  getNextScreenshot(): Observable<string> {
    switch (this.screenshotStatus) {

      case 'no-updates':
        console.log(chalk.blue('> [Get Screenshot] No updates'));
        // Send latest screenshot available
        return this.nextScreenshotIdObs$.take(1);

      case 'new-available':
        console.log(chalk.blue('> [Get Screenshot] New Screenshot available'));
        // Fetch the latest screenshot and wait for it
        this.screenshotStatus = 'fetch-pending';
        this.socket.emit(LectureSocketEvents.Server.GET_SCREENSHOT);
        return this.nextScreenshotIdObs$.skip(1).take(1);

      case 'fetch-pending':
        console.log(chalk.blue('> [Get Screenshot] Fetch pending'));
        // Wait for latest screenshot fetch
        return this.nextScreenshotIdObs$.skip(1).take(1);
    }
  }

  toLectureModel() { // TODO improve
    return {
      uuid: this.lectureId,
      course: 'courceName', // TODO set proper course name
      name: this.name,
      live: true
    }
  }

}
