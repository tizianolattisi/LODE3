import Socket = SocketIO.Socket;
import {BehaviorSubject} from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Lecture} from '../models/db/Lecture';
import {STORAGE_PATH, STORAGE_SLIDES_FOLDER} from '../commons/config';
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
    console.log(chalk.green(`> New live lecture registered to server (id: ${this.lectureId}, pin: ${this.pin}, started: ${this.started})`));
  }


  startLecture() {
    console.log(chalk.blue(`> Starting lecture ${this.lectureId}...`));
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
        console.log(chalk.green(`> Lecture started (id: ${this.lectureId}, pin: ${this.pin}, started: ${this.started})`));
      })
      .catch(err => {
        console.error(err);
        // TODO what to do?
      });
  }

  newScreenshotAvailable() {
    this.screenshotStatus = 'new-available';
    console.log(chalk.blue(`> New screenshot for lecture ${this.lectureId} is available (but still not downloaded to server).`));
  }

  saveScreenshot(image: string, timestamp: number, name?: string) {
    console.log(chalk.blue(`> Saving a new screenshot for lecture ${this.lectureId} (screenshot timestamp: ${timestamp})...`));

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

            // TODO decide
            // this.nextScreenshotId$.next(`${SERVER_STORAGE_PATH}/${this.lectureId}/${STORAGE_SLIDES_FOLDER}/${screenshotFile}`);
            this.nextScreenshotId$.next(lectureScreenshot.id)
            console.log(chalk.green(`> Screenshot with timestamp ${timestamp} saved in ${screenshotPath}`));
          })
          .catch(e => console.error(e)); // TODO handle error
      }
    });

  }

  stopLecture() {
    this.nextScreenshotId$.complete();
    console.log(chalk.yellow(`> Lecture ${this.lectureId} stopped.`));
    Lecture.update({uuid: this.lectureId}, {live: false})
      .then(res => console.log('ok')) // TODO handle
      .catch(e => console.error(e)); // TODO handle error
  }

  lectureDisconnected() {
    this.stopLecture();
    console.log(chalk.red(`> Lecture ${this.lectureId} disconnected.`));
  }

  getNextScreenshot(): Observable<string> {
    console.log(chalk.bold.blue(`> Screenshot request for lecture ${this.lectureId}...`));

    switch (this.screenshotStatus) {

      case 'no-updates':
        console.log(chalk.bold.white('> No fresh screenshot from raspberry -> send latest available.'));
        // Send latest screenshot available
        return this.nextScreenshotIdObs$.take(1);

      case 'new-available':
        console.log(
          chalk.bold.white('> New screenshot from raspberry is available but not downloaded -> fetch it and make applicant wait.')
        );

        // Fetch the latest screenshot and wait for it
        this.screenshotStatus = 'fetch-pending';
        this.socket.emit(LectureSocketEvents.Server.GET_SCREENSHOT);
        return this.nextScreenshotIdObs$.skip(1).take(1);

      case 'fetch-pending':
        console.log(chalk.bold.white('> New screenshot from raspberry is available and server is fetching it -> make applicant wait.'));
        // Wait for latest screenshot fetch
        return this.nextScreenshotIdObs$.skip(1).take(1);
    }
  }

  toLectureModel() { // TODO improve
    return {
      uuid: this.lectureId,
      course: 'Course Name', // TODO set proper course name
      name: this.name,
      live: true
    }
  }

}
