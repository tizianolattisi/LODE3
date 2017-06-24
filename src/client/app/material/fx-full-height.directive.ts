import {Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({
  selector: '[l3FxFullHeight]'
})
export class FxFullHeightDirective {

  constructor(el: ElementRef, renderer: Renderer2) {
    renderer.setStyle(el.nativeElement, 'height', '100%');
  }
}
