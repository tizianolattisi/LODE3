import {Component, Input, EventEmitter, Output} from '@angular/core';
import {AnnotationManager} from "../../annotation/AnnotationManager";
import {NoteTool} from "../../annotation/tools/NoteTool";

@Component({
  selector: 'viewer-toolbar',
  templateUrl: './viewer-toolbar.component.html',
  styleUrls: ['./viewer-toolbar.component.scss']
})
export class ViewerToolbarComponent {

  @Input() pdfviewer: any;
  @Input('currentPage') currentPage: number;
  @Input('totalPages') totalPages: number;
  @Output('pageSelected') pageSelectedOutput: EventEmitter<number> = new EventEmitter<number>();

  searchText: string;
  currentScale: any = {};

  showInputSearch: boolean = false;

  SCALE_VALUES = [
    {value: "0.10", name: "10%"},
    {value: "0.25", name: "25%"},
    {value: "0.50", name: "50%"},
    {value: "0.75", name: "75%"},
    {value: "1", name: "100%"},
    {value: "1.25", name: "125%"},
    {value: "1.5", name: "150%"}
  ];


    constructor(public am: AnnotationManager) {
    }

    ngOnInit(): void {
    if (this.pdfviewer) {
      // current and total pages counter
      this.pdfviewer.container.addEventListener('pagesinit', ()=> {
        this.totalPages = this.pdfviewer.pagesCount;
        this.currentPage = this.pdfviewer.currentPageNumber;
      });

      // current page listener
      this.pdfviewer.container.addEventListener('pagechange', ()=> {
        this.currentPage = this.pdfviewer.currentPageNumber;
      });
    }
  }

  addChangeSlideNote(page): void {
    var note = this.am.newNote(page);
    note.type = NoteTool.TYPE;
    note.data = "change-slide";
    this.am.saveNote(note);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      if (this.pdfviewer) {
        this.pdfviewer.currentPageNumber += 1;
        this.addChangeSlideNote(this.pdfviewer.currentPageNumber);
      } else {
        this.pageSelectedOutput.emit(this.currentPage + 1);
      }
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      if (this.pdfviewer) {
        this.pdfviewer.currentPageNumber -= 1;
        this.addChangeSlideNote(this.pdfviewer.currentPageNumber);
      } else {
        this.pageSelectedOutput.emit(this.currentPage - 1);
      }
    }
  }

  changePage(page: number): void {
    if (this.pdfviewer) {
      this.pdfviewer.currentPageNumber = page;
      this.addChangeSlideNote(this.pdfviewer.currentPageNumber);
    } else {
      this.pageSelectedOutput.emit(page);
    }
  }

  doSearch(searchText: string): void {
    if (this.pdfviewer) {
      this.searchText = searchText;
      this.pdfviewer.findController.executeCommand('find', {query: searchText, highlightAll: true});
    }
  }

  nextSearchMatch() {
    if (this.pdfviewer) {
      this.pdfviewer.findController.state.findPrevious = false;
      this.pdfviewer.findController.nextMatch();
    }
  }


  prevSearchMatch() {
    if (this.pdfviewer) {
      this.pdfviewer.findController.state.findPrevious = true;
      this.pdfviewer.findController.nextMatch();
    }
  }

}
