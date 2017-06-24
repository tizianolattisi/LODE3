import {LectureService} from '../../service/lecture.service';
import {ChangeDetectionStrategy, Component, NgZone, OnInit} from '@angular/core';

@Component({
  selector: 'l3-lecture-editor',
  templateUrl: './lecture-editor.component.html',
  styleUrls: ['./lecture-editor.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LectureEditorComponent implements OnInit {

  path: string;

  constructor(private service: LectureService, private ngZone: NgZone) {}

  ngOnInit() {
    console.log('Req');
    this.service.getSnapShot('lecture1').subscribe(path => {
      this.path = path;
      console.log('Path', this.path);
    }, err => {
      const e = err.json();
      console.log('Err', e);
      this.path = e;
    });
  }

}
