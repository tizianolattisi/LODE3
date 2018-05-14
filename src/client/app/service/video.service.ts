import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class VideoService {
  public BASE_URL: string
  constructor(
    private http: HttpClient) {
    this.BASE_URL = ''
  }

  FetchVideoData(path: string): Observable<string> {
    this.BASE_URL = 'http://localhost:3000/' + path + '/'
    return this.http.get(this.BASE_URL + "data.xml", { responseType: 'text' })

  }
}
