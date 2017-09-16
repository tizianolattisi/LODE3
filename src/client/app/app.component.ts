import { Component } from '@angular/core';
import { IconService } from './shared/icon.service';

@Component({
  selector: 'l3-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'l3';

  constructor(private iconService: IconService) {
    this.iconService.init();
  }
}
