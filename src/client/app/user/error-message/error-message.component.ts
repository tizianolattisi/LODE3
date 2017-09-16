import {ErrorResponse} from '../../service/model/error-response';

import {Component, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'l3-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorMessageComponent {

  @Input()
  error = null as ErrorResponse;

  @Input()
  messages: {[status: number]: string};

}
