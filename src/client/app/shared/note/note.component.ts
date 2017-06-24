import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'l3-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
