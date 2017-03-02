import {Component, Input, ViewChild, ElementRef, Renderer} from '@angular/core';
import {Router} from "@angular/router";
import {StoreService} from "../../shared/store.service";
import {AnnotationManager} from "../../annotation/AnnotationManager";
import {BaseAnnotation} from "../../annotation/model/BaseAnnotation";

@Component({
  selector: 'pdf-editor',
  templateUrl: './pdf-editor.component.html',
  styleUrls: ['./pdf-editor.component.css']
})
export class PdfEditorComponent {

  @Input() pdfUrl: string;

  @ViewChild('pdfViewer') pdfViewerElem: ElementRef;

  PDFJS: PDFJSStatic;
  PDFViewer: any;
  PDFViewerCurrentPage: number = 1;

  lefSidebarTab: number = -1;
  pdfLoading: boolean = true;
  pdfLoadingFail: boolean = false;
  pdfSizeMb: number = 0;

  videoUrl: string;
  hideVideo: boolean = false;

  downloadPdfStatus: number = 0; // -1: error, 0: nothing, 1: loading, 2: complete

  constructor(private router: Router, private storeService: StoreService, private renderer: Renderer, public am: AnnotationManager) {

    // Init PDFJS
    this.PDFJS = PDFJS;
    this.PDFJS.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.js';

    this.storeService.pdfLoading.subscribe((status)=> {
      if (status == -2) {
        this.pdfLoading = false;
      } else if (status == -1) {
        this.pdfLoading = false;
        this.pdfLoadingFail = true;
      } else {
        this.pdfSizeMb = status;
      }
    });

    // load video if available
    this.videoUrl = this.storeService.getVideoUrl();
  }

  ngOnInit(): void {

    /*
     * Init PDFViewer
     */

    // link service
    // let pdfLinkService = new PDFJS.PDFLinkService();

    // pdf viewer
    this.PDFViewer = new (PDFJS as any).PDFViewer({
      container: this.pdfViewerElem.nativeElement,
      // linkService: pdfLinkService
    });

    // pdfLinkService.setViewer(this.PDFViewer);

    // search
    let pdfFindController = new (<any>PDFJS).PDFFindController({
      pdfViewer: this.PDFViewer
    });
    this.PDFViewer.setFindController(pdfFindController);

    // PDF viewer is initialized and ready when event 'pagesinit' is fired
    this.renderer.listen(this.pdfViewerElem.nativeElement, 'pagesinit', ()=> {
      this.PDFViewer.currentScaleValue = 1;
    });

    this.storeService.pdfDocument.subscribe((doc)=> {
      if (doc) {
        this.PDFViewer.setDocument(doc);
      }
    });

    this.PDFViewer.container.addEventListener('pagechange', (e: any) => {
      this.PDFViewerCurrentPage = e.pageNumber;
    });

    this.storeService.registerPdfViewer(this.PDFViewer);
  }

  selectNoteOnCanvas(data: BaseAnnotation) {
    this.am.selectAnnotation(data.uuid, data.pageNumber);
  }

  downloadPdf() {
    this.downloadPdfStatus = 1;
    let obs = this.storeService.downloadPdf();
    if (obs) {
      obs.subscribe(data => {
        saveAs(data, "slides.pdf");
        this.downloadPdfStatus = 2;
      }, err => {
        this.downloadPdfStatus = -1;
      });
    } else {
      this.downloadPdfStatus = -1;
    }
  }

  switchLeftSidebar(tab: number) {
    this.lefSidebarTab = (this.lefSidebarTab == tab) ? (-1) : (tab);
  }

  onVideoHtmlReady(htmlVideoElem: HTMLVideoElement) {
    this.storeService.registerHtmlVideoElement(htmlVideoElem);
  }

  showHideVideo() {
    this.hideVideo = !this.hideVideo;
  }

  goToVideo() {
    this.router.navigate(['/video']);
  }

}
