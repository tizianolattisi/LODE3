import {Lecture} from './model/lecture';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {toApiErrorResponse} from './to-error-response';
import {Observable} from 'rxjs/Rx';
import {ErrorResponse} from './model/error-response';
import {of} from 'rxjs/observable/of';
import {HttpHeaders} from '@angular/common/http';
import {Screenshot} from './model/screenshot';

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

  getScreenshot(lectureId: string, pin: string): Observable<Screenshot> {
    const headers = new HttpHeaders({'pin': pin});
    return this.http.get<string>(`/api/lecture/${lectureId}/screenshot`, {headers})
      .catch(toApiErrorResponse);
  }

  getUserScreenshots(lectureId: string): Observable<Screenshot[]> {
    return this.http.get<string>(`/api/lecture/${lectureId}/myscreenshots`)
      .catch(toApiErrorResponse);
  }

  getScreenshotImage(lectureId: string, screenshot: Screenshot): Observable<Screenshot> {
    return this.http.get(`/storage/${lectureId}/slides/${screenshot.fileName}`, {responseType: 'arraybuffer'})
      .map(img => {
        return {...screenshot, img};
      })
      .catch(toApiErrorResponse);
  }

}
