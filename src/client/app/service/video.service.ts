import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toApiErrorResponse } from './to-error-response';
import { Observable } from 'rxjs/Rx';
import { Lecture } from '../../../server/models/db/Lecture'
@Injectable()
export class VideoService {

  constructor(private http: HttpClient) { }

  getMedia(lectureId: string): Observable<Lecture> {
    return this.http.get<string>(`/api/lecture/${lectureId}`)
      .catch(toApiErrorResponse);
  }
}
