import {Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({
  selector: '[l3FxFullWidth]'
})
export class FxFullWidthDirective {

  constructor(el: ElementRef, renderer: Renderer2) {
    renderer.setStyle(el.nativeElement, 'width', '100%');
  }
}
