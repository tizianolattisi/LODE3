import {Directive, SimpleChanges, ElementRef, Input} from '@angular/core';
import {Quill as tQuill, DeltaStatic} from "quill";

declare var Quill: tQuill;

@Directive({
  selector: '[quill]'
})
export class QuillDirective {

  @Input('quill') text: DeltaStatic;

  quillEditor: tQuill;

  constructor(private el: ElementRef) {
    // init quill
    this.quillEditor = new Quill(this.el.nativeElement, {
      readOnly: true,
      modules: {
        formula: true
      }
    });
  }

  ngOnInit() {
    if (this.text) {
      this.quillEditor.setContents(this.text);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.text) {
      this.quillEditor.setContents(this.text);
    }
  }

}
