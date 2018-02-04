import {Directive, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[l3Resizable]'
})
export class ResizableDirective {


  @Input()
  resizableElement: HTMLElement;

  allowResize = false;
  oldX: number;
  oldY: number;

  @HostListener('mousedown', ['$event.clientX', '$event.clientY'])
  onMouseDown(x: number, y: number) {
    this.oldX = x;
    this.oldY = y;
    this.allowResize = true;
  }

  @HostListener('mouseup', [])
  @HostListener('window:mouseup', [])
  onMouseUp() {
    this.allowResize = false;
  }

  @HostListener('mousemove', ['$event'])
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (this.allowResize) {
      const newW = parseInt(this.resizableElement.style.width, 10) + (e.clientX - this.oldX);
      const newH = parseInt(this.resizableElement.style.height, 10) + (e.clientY - this.oldY);

      if (newW > parseInt(this.resizableElement.style.minWidth, 10)) {
        this.resizableElement.style.width = newW + 'px';
        this.oldX = e.clientX;
      }

      if (newH >= parseInt(this.resizableElement.style.minHeight, 10)) {
        this.resizableElement.style.height = newH + 'px';
        this.oldY = e.clientY;
      }

      e.stopPropagation();
      e.preventDefault();
    }
  }

}
