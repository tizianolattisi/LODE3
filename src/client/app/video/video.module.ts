import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { videoRoutes } from './video.routing';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(videoRoutes)
  ],
  declarations: []
})
export class VideoModule { }
