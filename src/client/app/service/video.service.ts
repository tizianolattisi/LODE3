import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class VideoService {
  public BASE_URL: string
  constructor(
    private http: HttpClient) {
    this.BASE_URL = 'http://localhost:3000'
    //this.BASE_URL = 'http://lode.disi.unitn.it/cad'
  }

  FetchVideoData(course: string, name: string): Observable<string> {

    let url = this.BASE_URL + '/lectures/' + course + '/' + name + "/data.xml"
    return this.http.get(url, { responseType: 'text' })

  }
}
