import { base64ArrayBuffer } from './array-to-base64';
import { Lecture } from './model/lecture';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { toApiErrorResponse } from './to-error-response';
import { Observable } from 'rxjs/Rx';
import { ErrorResponse } from './model/error-response';
import { of } from 'rxjs/observable/of';
import { Screenshot } from './model/screenshot';

@Injectable()
export class LectureService {

  constructor(private http: HttpClient) { }

  getLectures(live?: boolean): Observable<Lecture[]> {
    return this.http.get<Lecture[]>(`/api/lecture?live=${live ? 'true' : 'false'}`)
      .catch(toApiErrorResponse);
  }

  getLecture(lectureId: string): Observable<Lecture> {
    return this.http.get<string>(`/api/lecture/${lectureId}`)
      .catch(toApiErrorResponse);
  }

  verifyPin(lectureId: string, pin: string): Observable<boolean> {
    return this.http.post<void>(`/api/lecture/${lectureId}/verifypin`, { pin })
      .map(res => true)
      .catch(toApiErrorResponse)
      .catch((err: ErrorResponse) => of(false));
  }

  getScreenshot(lectureId: string, pin: string, blank?: boolean): Observable<Screenshot> {
    const headers = new HttpHeaders({ 'pin': pin });

    let params = new HttpParams();

    if (blank) {
      params = params.append('blank', 'true');
    }

    return this.http.get<string>(`/api/lecture/${lectureId}/screenshot`, { headers, params })
      .catch(toApiErrorResponse);
  }

  getUserScreenshots(lectureId: string): Observable<Screenshot[]> {
    return this.http.get<string>(`/api/lecture/${lectureId}/myscreenshots`)
      .catch(toApiErrorResponse);
  }

  getScreenshotImage(lectureId: string, screenshot: Screenshot): Observable<Screenshot> {
    if (screenshot.fileName === 'blank') {
      return of({ ...screenshot });
    } else {
      return this.http.get(`/storage/${lectureId}/slides/${screenshot.fileName}`, { responseType: 'arraybuffer' })
        .map(arrayBuffer => base64ArrayBuffer(arrayBuffer)) // Convert binary img to bas64
        .map(img => ({ ...screenshot, img })) // Return screenshot with data + img
        .catch(toApiErrorResponse);
    }
  }

  downloadPdf(lectureId: string): Observable<Blob> {
    return this.http.get(`/api/lecture/${lectureId}/pdf`, { responseType: 'blob' });
  }

}
