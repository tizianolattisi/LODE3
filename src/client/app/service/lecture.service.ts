import {Lecture} from './model/lecture';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {toApiErrorResponse} from './to-error-response';
import {Observable} from 'rxjs/Rx';
import {ErrorResponse} from './model/error-response';
import {of} from 'rxjs/observable/of';

@Injectable()
export class LectureService {

  constructor(private http: HttpClient) {}

  getLectures(live?: boolean): Observable<Lecture[]> {
    return this.http.get<Lecture[]>(`/api/lecture?live=${live ? 'true' : 'false'}`)
      .catch(toApiErrorResponse);
  }

  getLecture(lectureId: string): Observable<Lecture> {
    return this.http.get<string>(`/api/lecture/${lectureId}`)
      .catch(toApiErrorResponse);
  }

  verifyPin(lectureId: string, pin: string): Observable<boolean> {
    return this.http.post<void>(`/api/lecture/${lectureId}/verifypin`, {pin})
      .map(res => true)
      .catch(toApiErrorResponse)
      .catch((err: ErrorResponse) => of(false));
  }

  getSnapShot(lectureId: string) {
    return this.http.get<string>(`/api/lecture/${lectureId}/snapshot`)
      .catch(toApiErrorResponse);
  }

}
