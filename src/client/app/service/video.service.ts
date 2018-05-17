import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class VideoService {
  public BASE_URL: string
  private HOST: string
  constructor(
    private http: HttpClient) {
    this.BASE_URL = ''
    var href = window.location.href;
    var arr = href.split("/");
    this.HOST = arr[0] + "//" + arr[2] + "/cad"
  }

  FetchVideoData(path: string): Observable<string> {
    this.BASE_URL = this.HOST + '/' + path
    return this.http.get(this.BASE_URL + "/data.xml", { responseType: 'text' })
  }
}
