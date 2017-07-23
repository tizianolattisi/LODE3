import {Lecture} from './model/lecture';
import {Injectable} from '@angular/core';
import {HttpParams, HttpClient} from '@angular/common/http';

@Injectable()
export class LectureService {

  constructor(private http: HttpClient) {}


  getLectures(live?: boolean) {
    // const params = new HttpParams(); // TODO does not work
    // params.set('live', live ? 'true' : 'false');
    return this.http.get<Lecture[]>(`/api/lecture?live=${live ? 'true' : 'false'}` /*, {params} */);
  }

  getSnapShot(lectureId: string) {
    return this.http.get<string>(`/api/lecture/${lectureId}/snapshot`);
  }

}
