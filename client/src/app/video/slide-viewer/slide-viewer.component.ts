import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {StoreService} from "../../shared/store.service";

@Component({
  selector: 'slide-viewer',
  templateUrl: './slide-viewer.component.html'
})
export class SlideViewerComponent implements OnInit {


  canvasId: string;
  pdfDocument: PDFDocumentProxy;
  pdfViewerLike: any;

  @ViewChild('canvas') canvasElem: ElementRef;
  @ViewChild('canvasContainer') canvasContainerElem: ElementRef;

  public constructor(private storeService: StoreService) {
    PDFJS.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.js';
  }

  ngOnInit(): void {

    // register canvas as pdfViewer
    this.pdfViewerLike = {
      currentScaleValue: 'auto',
      container: this.canvasElem.nativeElement
    };
    this.storeService.registerPdfViewer(<any>this.pdfViewerLike);


    this.storeService.pdfDocument.subscribe(pdfDocument => {
      if (pdfDocument) {
        this.pdfDocument = pdfDocument;
        // render first page
        this.renderPage(1);
      }
    });

    // listen for slide changes
    this.storeService.currentSlide.subscribe((slide) => {
      this.showPage(slide);
    });
  }

  renderPage(page: number) {
    this.pdfDocument.getPage(page)
      .then((pdfPage: PDFPageProxy)=> {

        let viewport = pdfPage.getViewport(1);

        this.pdfViewerLike.currentScale = (this.canvasContainerElem.nativeElement.getBoundingClientRect().width / viewport.width);

        let context = this.canvasElem.nativeElement.getContext('2d');
        this.canvasElem.nativeElement.height = viewport.height;
        this.canvasElem.nativeElement.width = viewport.width;

        let renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        // before render remove canvas annotation
        let annCanvasContainer = this.canvasContainerElem.nativeElement.getElementsByClassName('lower-canvas');
        if (annCanvasContainer.length > 0) {
          for (let i = annCanvasContainer.length - 1; i >= 0; i--) {
            annCanvasContainer[i].parentElement.removeChild(annCanvasContainer[i]);
          }
        }

        pdfPage.render(renderContext)
          .then(()=> {
            this.canvasId = 'page' + page;
            this.canvasElem.nativeElement.dispatchEvent(new CustomEvent("pagerendered", {
              detail: {
                pageNumber: page,
                canvas: this.canvasContainerElem.nativeElement
              }
            }));
          });
      });
  }

  showPage(page: number) {

    if (!page || page <= 0) {
      return;
    }
    this.renderPage(page);
  }

}
