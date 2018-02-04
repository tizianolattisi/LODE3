import {Directive, Input, ElementRef, HostListener} from '@angular/core';
import {CANVAS_SIZE, getCanvasHeight} from '../shared/canvas-size';

@Directive({
  selector: '[l3SameSize]'
})
export class SameSizeDirective {

  @Input() complete: boolean;

  @Input() resizeElemId: string;

  constructor(private elemRef: ElementRef) {}

  @HostListener('load')
  onImageLoad() {
    const resizeElem = document.getElementById(this.resizeElemId);

    if (this.elemRef.nativeElement && resizeElem) {
      const w = this.elemRef.nativeElement.width;
      const h = this.elemRef.nativeElement.height;

      resizeElem.setAttribute('width', w);
      resizeElem.setAttribute('height', h);
      resizeElem.setAttribute('viewBox', `0 0 ${CANVAS_SIZE.W} ${getCanvasHeight(w, h)}`);
    }
  }

}
