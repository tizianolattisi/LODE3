import Socket = SocketIO.Socket;
import {Observable} from 'rxjs/Observable';
import {LiveLecture} from './live-lecture';
import {Lecture} from '../models/db/Lecture';
import * as chalk from 'chalk';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/take';


class LiveLectureService {

  private liveLectures: {[lectureId: string]: LiveLecture} = {};

  getLiveLectureIds(): string[] {
    return Object.keys(this.liveLectures);
  }

  getLiveLectures(): Lecture[] {
    return Object.keys(this.liveLectures).map(lId => this.liveLectures[lId].toLectureModel() as Lecture);
  }

  registerLecture(lectureId: string, socket: Socket, data: {name?: string; pin: string}): void {
    if (!this.liveLectures[lectureId]) {
      const liveLecture = new LiveLecture(lectureId, socket, data.pin, data.name);
      this.addLiveLecture(lectureId, liveLecture);
    }
    // TODO handle
  }

  startLecture(lectureId: string) {
    const ll = this.getLiveLecture(lectureId);
    if (ll) {
      ll.startLecture();
    } else {
      // TODO handle
      console.error('LL not found');
    }
  }

  newScreenshotAvailable(lectureId: string) {
    const ll = this.getLiveLecture(lectureId);
    if (ll) {
      ll.newScreenshotAvailable();
    } else {
      // TODO handle
      console.error('LL not found');
    }
  }

  saveScreenshot(lectureId: string, data: {image: string; timestamp: number; name?: string}) { // TODO define data
    const ll = this.getLiveLecture(lectureId);
    if (ll) {
      ll.saveScreenshot(data.image, data.timestamp, data.name);
    } else {
      // TODO handle
      console.error('LL not found');
    }
  }

  stopLecture(lectureId: string) {
    const ll = this.getLiveLecture(lectureId);
    if (ll) {
      ll.stopLecture();
      this.removeLiveLecture(lectureId);
    } else {
      // TODO handle
      console.error('LL not found');
    }
  }

  lectureDisconnected(lectureId: string) {
    const ll = this.getLiveLecture(lectureId);
    if (ll) {
      ll.lectureDisconnected();
      this.removeLiveLecture(lectureId);
    } else {
      // TODO handle
      console.error('LL not found');
    }
  }


  private addLiveLecture(lectureId: string, liveLecture: LiveLecture): void {
    this.liveLectures[lectureId] = liveLecture;
  }

  private getLiveLecture(lectureId: string) {
    return this.liveLectures[lectureId];
  }

  private removeLiveLecture(lectureId: string): void {
    delete this.liveLectures[lectureId];
  }

  getNextScreenshot(lectureId: string): Observable<string> {
    const ll = this.getLiveLecture(lectureId);
    if (ll) {
      return ll.getNextScreenshot();
    } else {
      return Observable.throw(new Error('Live Lecture not exists'));
      // TODO handle
    }
  }

}

const service = new LiveLectureService();

export {service as LiveLectureService};
