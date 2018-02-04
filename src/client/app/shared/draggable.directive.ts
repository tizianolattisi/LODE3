import {Directive, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[l3Draggable]'
})
export class DraggableDirective {

  @Input() draggableElement: HTMLElement;
  @Input('preventDrag') preventDrag: boolean;

  allowDrag = false;
  oldX: number;
  oldY: number;

  @HostListener('mousedown', ['$event.clientX', '$event.clientY'])
  onMouseDown(x: number, y: number) {
    if (!this.preventDrag) {
      this.oldX = x;
      this.oldY = y;

      this.draggableElement.style.position = 'fixed';

      this.draggableElement.style.top =
        (this.draggableElement.style.top) ? (this.draggableElement.style.top) : (this.draggableElement.getBoundingClientRect().top + 'px');
      this.draggableElement.style.left = (this.draggableElement.style.left) ?
        (this.draggableElement.style.left) : (this.draggableElement.getBoundingClientRect().left + 'px');

      this.draggableElement.style.bottom = null;
      this.draggableElement.style.right = null;
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
        this.draggableElement.style.top = (parseInt(this.draggableElement.style.top, 10)) + (e.clientY - this.oldY) + 'px';
        this.draggableElement.style.left = (parseInt(this.draggableElement.style.left, 10)) + (e.clientX - this.oldX) + 'px';

        this.oldY = e.clientY;
        this.oldX = e.clientX;

        e.preventDefault();
      }
    }
  }

}
