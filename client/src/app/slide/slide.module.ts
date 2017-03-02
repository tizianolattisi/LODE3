import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideViewerComponent } from './slide-viewer/slide-viewer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SlideViewerComponent],
  exports: [SlideViewerComponent]
})
export class SlideModule { }
