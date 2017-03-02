import {Directive, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[draggable]'
})
export class DraggableDirective {


  @Input('draggable') element: HTMLElement;
  @Input('preventDrag') preventDrag: boolean;

  allowDrag: boolean = false;
  oldX: number;
  oldY: number;

  @HostListener('mousedown', ['$event.clientX', '$event.clientY'])
  onMouseDown(x: number, y: number) {
    if (!this.preventDrag) {
      this.oldX = x;
      this.oldY = y;

      this.element.style.position = 'fixed';

      this.element.style.top = (this.element.style.top) ? (this.element.style.top) : (this.element.getBoundingClientRect().top + 'px');
      this.element.style.left = (this.element.style.left) ? (this.element.style.left) : (this.element.getBoundingClientRect().left + 'px');

      this.allowDrag = true;
    }
  }

  @HostListener('mouseup', [])
  @HostListener('window:mouseup', [])
  onMouseUp() {
    if (!this.preventDrag) {
      this.allowDrag = false;
    }
  }

  @HostListener('mousemove', ['$event'])
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.preventDrag) {
      if (this.allowDrag) {
        this.element.style.top = (parseInt(this.element.style.top)) + (e.clientY - this.oldY) + 'px';
        this.element.style.left = (parseInt(this.element.style.left)) + (e.clientX - this.oldX) + 'px';

        this.oldY = e.clientY;
        this.oldX = e.clientX;

        e.preventDefault();
      }
    }
  }

}
