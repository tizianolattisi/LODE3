import { Component, OnInit } from '@angular/core';
import { Lecture } from '../../service/model/lecture'
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-state';

@Component({
  selector: 'l3-lecture-viewer',
  templateUrl: './lecture-viewer.component.html',
  styleUrls: ['./lecture-viewer.component.scss']
})
export class LectureViewerComponent implements OnInit {

  lecture: Lecture
  videoUrl: string //test fino a quando non ho il video, in seguito sarà di tipo Video

  constructor(
    private store: Store<AppState>) {
  }

  ngOnInit() {
    this.videoUrl = 'http://latemar.science.unitn.it/LODE/LinguaggiDiProgrammazione/12-12-CopyConstructor/content/movie.mp4'
    // estraggo informazioni sulla lezione
    this.store.select(s => s.lecture.currentLecture).subscribe(data => {
      this.lecture = data
    })
  }
}
