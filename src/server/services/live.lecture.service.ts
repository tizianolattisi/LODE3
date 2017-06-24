import Socket = SocketIO.Socket;
import {Observable} from 'rxjs/Observable';
import {LiveLecture} from './live-lecture';
import {ILecture, IScreenshotComplete} from '../models/db/Lecture';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/take';


class LiveLectureService {

  private liveLectures: {[lectureId: string]: LiveLecture} = {};

  getLiveLectureIds(): string[] {
    return Object.keys(this.liveLectures);
  }

  getLiveLectures(): ILecture[] {
    return Object.keys(this.liveLectures).map(lId => this.liveLectures[lId].toLectureModel());
  }


  private addLiveLecture(lectureId: string, liveLecture: LiveLecture): void {
    this.liveLectures[lectureId] = liveLecture;
  }

  getLiveLecture(lectureId: string): ILecture {
    const l = this.liveLectures[lectureId];
    return l ? l.toLectureModel() : null;
  }

  private removeLiveLecture(lectureId: string): void {
    delete this.liveLectures[lectureId];
  }

  liveLectureExists(lectureId: string): boolean {
    return !!this.liveLectures[lectureId];
  }

  getPin(lectureId: string): string {
    const l = this.liveLectures[lectureId];
    return l ? l.getPin() : null;
  }

  registerLecture(lectureId: string, socket: Socket, data: {name?: string; pin: string}): void {
    if (!this.liveLectures[lectureId]) {
      const liveLecture = new LiveLecture(lectureId, socket, data.pin, data.name);
      this.addLiveLecture(lectureId, liveLecture);
    }
    // TODO handle
  }

  startLecture(lectureId: string) {
    const ll = this.liveLectures[lectureId];
    if (ll) {
      ll.startLecture();
    } else {
      // TODO handle
      console.error(`Live lecture with id ${lectureId} not found.`);
    }
  }

  newScreenshotAvailable(lectureId: string) {
    const ll = this.liveLectures[lectureId];
    if (ll) {
      ll.newScreenshotAvailable();
    } else {
      // TODO handle
      console.error(`Live lecture with id ${lectureId} not found.`);
    }
  }

  saveScreenshot(lectureId: string, data: {image: string; timestamp: number; name?: string}) { // TODO define data
    const ll = this.liveLectures[lectureId];
    if (ll) {
      ll.saveScreenshot(data.image, data.timestamp, data.name);
    } else {
      // TODO handle
      console.error(`Live lecture with id ${lectureId} not found.`);
    }
  }

  stopLecture(lectureId: string) {
    const ll = this.liveLectures[lectureId];
    if (ll) {
      ll.stopLecture();
      this.removeLiveLecture(lectureId);
    } else {
      // TODO handle
      console.error(`Live lecture with id ${lectureId} not found.`);
    }
  }

  lectureDisconnected(lectureId: string) {
    const ll = this.liveLectures[lectureId];
    if (ll) {
      ll.lectureDisconnected();
      this.removeLiveLecture(lectureId);
    } else {
      // TODO handle
      console.error(`Live lecture with id ${lectureId} not found.`);
    }
  }

  getNextScreenshot(lectureId: string): Observable<IScreenshotComplete> {
    const ll = this.liveLectures[lectureId];
    if (ll) {
      return ll.getNextScreenshot();
    } else {
      return Observable.throw(new Error(`Live lecture with id ${lectureId} not found.`));
      // TODO handle
    }
  }

}

const service = new LiveLectureService();

export {service as LiveLectureService};
