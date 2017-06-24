import {Injectable} from '@angular/core';
import {HttpAuth} from './http-auth.service';

@Injectable()
export class LectureService {

  constructor(private http: HttpAuth) {}

  getSnapShot(lectureId: string) {
    return this.http.get(`/api/lecture/${lectureId}/snapshot`).map(res => res.json());
  }

}
