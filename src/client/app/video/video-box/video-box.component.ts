import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'video-box',
  templateUrl: './video-box.component.html',
  styleUrls: ['./video-box.component.scss']
})
export class VideoBoxComponent implements OnInit {

  @Input('videoUrl') videoUrl: string;

  ngOnInit(): void {
  }

}
