import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'l3-notes-bar',
  templateUrl: './notes-bar.component.html',
  styleUrls: ['./notes-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
