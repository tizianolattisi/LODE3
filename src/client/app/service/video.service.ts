import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VideoService {
    public BASE_URL: string
    private HOST: string
    constructor(
        private http: HttpClient) {
        this.BASE_URL = ''
        this.HOST = 'http://latemar.science.unitn.it/cad'
        //this.HOST = 'http://127.0.0.1:5000' //utilizzato per sviluppo in locale
    }

    FetchVideoData(path: string): Observable<string> {
        this.BASE_URL = this.HOST + '/' + path
        return this.http.get(this.BASE_URL + "/data.xml", { responseType: 'text' })
    }
}
