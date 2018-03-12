import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class VideoService {
  public BASE_URL: string
  constructor(
    private http: HttpClient) { this.BASE_URL = 'http://127.0.0.1:8887' }

  FetchVideoData(uuid: string): Observable<string> {

    let url = this.BASE_URL + '/' + uuid + "/data.xml"
    return this.http.get(url, { responseType: 'text' })

  }
}
