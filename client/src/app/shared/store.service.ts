import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {UserService} from "../user/user.service";
import {Http, ResponseContentType} from "@angular/http";

@Injectable()
export class StoreService {


  private LODE_URL = 'http://latemar.science.unitn.it/cad/lectures';

  private LS_DATA = 'data';

  /* -----
   * Pdf
   ----- */

  // pdfjs document
  private _pdfDocument: BehaviorSubject<PDFDocumentProxy> = new BehaviorSubject(null);
  public pdfDocument: Observable<PDFDocumentProxy> = this._pdfDocument.asObservable();
  // pdf hash
  public pdfHash: string;

  // utils
  private _pdfLoading: BehaviorSubject<number> = new BehaviorSubject(0);
  public pdfLoading: Observable<number> = this._pdfLoading.asObservable();

  /* -----
   * Video
   ----- */

  private _lodeLecture: BehaviorSubject<LodeLecture> = new BehaviorSubject(null);
  public lodeLecture: Observable<LodeLecture> = this._lodeLecture.asObservable();

  private _currentSlide: BehaviorSubject<number> = new BehaviorSubject(0);
  currentSlide: Observable<number> = this._currentSlide.asObservable();
  private _currentSlideIndex: BehaviorSubject<number> = new BehaviorSubject(0);
  currentSlideIndex: Observable<number> = this._currentSlideIndex.asObservable();
  private _currentTime: BehaviorSubject<number> = new BehaviorSubject(0);
  currentTime: Observable<number> = this._currentTime.asObservable();

  public course: string;
  public lecture: string;

  /* -----
   * View Elements
   ----- */

  private _pdfViewer: BehaviorSubject<any> = new BehaviorSubject(null);
  public pdfViewer: Observable<any> = this._pdfViewer.asObservable();

  private _htmlVideoElement: BehaviorSubject<HTMLVideoElement> = new BehaviorSubject(null);
  public htmlVideoElement: Observable<HTMLVideoElement> = this._htmlVideoElement.asObservable();


  constructor(private userService: UserService, private http: Http) {

    this.userService.userData.subscribe(ud => {
      if (ud.email) { // user is logged
        this.pdfHash = (<any>window).dataPdfHash;
        this.course = (<any>window).dataCourse;
        this.lecture = (<any>window).dataLecture;

        if (!this.pdfHash) {
          let data = this.getCachedData();
          this.pdfHash = data.dataPdfHash;
          this.course = data.dataCourse;
          this.lecture = data.dataLecture;
        }
        this.setCacheData({
          dataPdfHash: this.pdfHash,
          dataCourse: this.course,
          dataLecture: this.lecture,
        });

        this.loadData();
      }
    });
  }

  /* -----
   * Load datas
   ----- */

  private loadData() {
    if (this.course && this.lecture) { // load all data (video + pdf)

      let docPromise = this.loadPdfDocument();
      let lecturePromise = this.loadLodeLecture();

      Promise.all([docPromise, lecturePromise])
        .then(values => {
          this._pdfDocument.next(values[0]);
          this._lodeLecture.next(values[1] as any);
        });


    } else { // load only pdf
      this.loadPdfDocument()
        .then(doc => {
          this._pdfDocument.next(doc);
        });
    }
  }

  private loadPdfDocument(): Promise<PDFDocumentProxy> {

    return new Promise<PDFDocumentProxy>((resolve, reject)=> {
      if (this.pdfHash) {

        PDFJS.getDocument({
          url: '/api/pdfs/' + this.pdfHash,
          httpHeaders: {'Authorization': 'Bearer ' + this.userService.getToken()}
        }, null, null, progress => {
          this._pdfLoading.next(progress.loaded / 1024 / 1024);
        }).then((pdfDocument: PDFDocumentProxy) => {
          this._pdfLoading.next(-2);
          return resolve(pdfDocument);
        }, err => {
          this._pdfLoading.next(-1);
          return reject(null);
        });
      } else {
        this._pdfLoading.next(-1);
        return reject(null);
      }
    });

  }

  private loadLodeLecture(): Promise<LodeLecture> {

    return new Promise<LodeLecture>((resolve, reject)=> {
      this.http.get('api/courses/' + this.course + '/lectures/' + this.lecture, {headers: this.userService.HEADERS})
        .map(res => res.json())
        .subscribe((res: LodeLecture) => {
          return resolve(res);
        }, (err) => {
          return reject(null);
        });
    });
  }

  private getCachedData() {
    let data = localStorage.getItem(this.LS_DATA);
    return (data) ? (JSON.parse(data)) : ({});
  }

  private setCacheData(data: any) {
    localStorage.setItem(this.LS_DATA, JSON.stringify(data));
  }

  /* -----
   * Pdf Editor
   ----- */

  downloadPdf(): Observable<Blob> {
    if (this.pdfHash) {
      return this.http.get('/api/pdfs/' + this.pdfHash + '/download', {
        responseType: ResponseContentType.Blob,
        headers: this.userService.HEADERS
      })
        .map(res => new Blob([res.blob()], {type: 'application/pdf'}));
    } else {
      return null;
    }
  }

  registerPdfViewer(pdfViewer: any) {
    this._pdfViewer.next(pdfViewer);
  }


  /* -----
   * Video methods
   ----- */

  getVideoUrl() {
    return (this.course && this.lecture) ? (this.LODE_URL + '/' + this.course + '/' + this.lecture + '/content/movie.mp4') : (null);
  }

  registerHtmlVideoElement(videoElem: HTMLVideoElement) {
    this._htmlVideoElement.next(videoElem);

    // update video elem time
    videoElem.addEventListener('loadedmetadata', ()=> {
      this._htmlVideoElement.getValue().currentTime = this._currentTime.getValue();

      // start listen for time change
      this._htmlVideoElement.getValue().addEventListener('timeupdate', (res)=> {
        this.updateCurrentTime((<HTMLVideoElement>res.target).currentTime);
        this.autoUpdateSlide((<HTMLVideoElement>res.target).currentTime);
      });
    }, false);
  }

  getSlideTotalPages() {
    return (this._pdfDocument.getValue()) ? (this._pdfDocument.getValue().numPages) : (0);
  }

  getVideoDuration() {
    return (this._htmlVideoElement.getValue()) ? (this._htmlVideoElement.getValue().duration) : (0.0);
  }

  // update slides page & index when video time change
  private autoUpdateSlide(time: number) {
    let lodeLecture = this._lodeLecture.getValue();
    if (lodeLecture) {
      let slide = lodeLecture.slides[this._currentSlideIndex.getValue() + 1];
      if (slide && slide.time < time) {
        this.updateCurrentSlides(this._currentSlideIndex.getValue() + 1);
      }
    }
  }

  // update and broadcast video time
  private updateCurrentTime(time: number) {
    this._currentTime.next(time);
  }

  // update and broadcast slide page & index
  private updateCurrentSlides(slideIndex: number) {
    if (slideIndex >= 0) {
      let page = this._lodeLecture.getValue().slides[slideIndex].page;
      if (page != this._currentSlide.getValue()) {
        this._currentSlide.next(page);
      }
      if (slideIndex != this._currentSlideIndex.getValue()) {
        this._currentSlideIndex.next(slideIndex);
      }
    }
  }

  setCurrentTime(time: number, start?: boolean) {

    time = (time >= 0) ? (Math.round(time)) : (0);
    if (time >= 0 && this._lodeLecture.getValue()) {
      // update slide page & index
      for (let i = 0; i < this._lodeLecture.getValue().slides.length; i++) {
        if (this._lodeLecture.getValue().slides[i].time > time) {
          this.updateCurrentSlides(i - 1);
          break;
        }
        if (i == this._lodeLecture.getValue().slides.length - 1) {
          this.updateCurrentSlides(i);
        }
      }

      this.updateCurrentTime(time);
      this._htmlVideoElement.getValue().currentTime = time;
      if (start) {
        this._htmlVideoElement.getValue().play();
      }
    }
  }

  setCurrentSlideIndex(slideIndex: number) {
    let slide = this._lodeLecture.getValue().slides[slideIndex];
    if (slide) {
      this.updateCurrentSlides(slideIndex);
      this.updateCurrentTime(slide.time);
      this._htmlVideoElement.getValue().currentTime = slide.time;
    }
  }

  setCurrentSlide(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= this.getSlideTotalPages()) {
      this._currentSlide.next(pageNumber);
    }
  }

  getCurrentTime(): number {
    return this._currentTime.getValue();
  }

  getCurrentSlide(): number {
    return this._currentSlide.getValue();
  }

  getCurrentSlideIndex(): number {
    return this._currentSlideIndex.getValue();
  }

}


interface LodeLecture {

  information: {
    course: string,
    title: string,
    professor: string
  },
  video: {
    url: string,
    start: Date,
    duration: number
  },
  slides: {
    page: number,
    thumbnailUrl: string,
    title: string,
    time: number
  }[]

}
