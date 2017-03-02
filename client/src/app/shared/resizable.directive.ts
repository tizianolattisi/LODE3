import {Directive, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[resizable]'
})
export class ResizableDirective {


  @Input('resizable') element: HTMLElement;

  allowResize: boolean = false;
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
      let newW = parseInt(this.element.style.width) + (e.clientX - this.oldX);
      let newH = parseInt(this.element.style.height) + (e.clientY - this.oldY);

      if (newW > parseInt(this.element.style.minWidth)) {
        this.element.style.width = newW + 'px';
        this.oldX = e.clientX;
      }

      if (newH >= parseInt(this.element.style.minHeight)) {
        this.element.style.height = newH + 'px';
        this.oldY = e.clientY;
      }

      e.stopPropagation();
      e.preventDefault();
    }
  }

}
