import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {StoreService} from "../../shared/store.service";
import {AnnotationManager} from "../../annotation/AnnotationManager";

@Component({
  selector: 'video-lecture',
  templateUrl: './video-lecture.component.html',
  styleUrls: ['./video-lecture.component.scss']
})
export class VideoLectureComponent {

  // video related variables
  videoUrl: string;

  timelineHighlightedNote: string;

  public constructor(private router: Router, public storeService: StoreService, public am: AnnotationManager) {
    // load video
    this.videoUrl = this.storeService.getVideoUrl();
  }


  onHtmlVideoElementReady(htmlVideoElem: HTMLVideoElement) {
    this.storeService.registerHtmlVideoElement(htmlVideoElem);
  }

  highlightTimelineNote(uuid: string) {
    this.timelineHighlightedNote = uuid;
  }

  changeSlide(page: number) {
    this.storeService.setCurrentSlide(page);
  }

  goToEditor() {
    this.router.navigate(['/editor']);
  }

}
