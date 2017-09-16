import {HttpErrorResponse} from '@angular/common/http';

export interface ErrorResponse {
  status: number;
  code: string;
  message: string;
}

export function responseToError(res: HttpErrorResponse): ErrorResponse {
  const payload = res ? res.error : {};
  return {
    status: res.status,
    code: payload.code,
    message: payload.message
  };
}
