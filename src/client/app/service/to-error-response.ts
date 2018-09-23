import { ErrorResponse } from './model/error-response';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

/**
 * Handle an http error response from APIs and convert it into a {@link ErrorResponse}.
 */
export const toApiErrorResponse = (err: HttpErrorResponse): Observable<any> => {

  const apiErr: ErrorResponse = err ?
    new ErrorResponse(
      err.status,
      err.error ? err.error.code : 'NO_PAYLOAD',
      err.error ? err.error.message : 'Payload was empty. No error messages are present.'
    ) :
    new ErrorResponse(
      0,
      'ERROR_IS_MISSING',
      'No http error provided.'
    );

  throw apiErr;
};
