import {Response} from '@angular/http';

export interface ErrorResponse {
  status: number;
  code: string;
  message: string;
}

export function responseToError(res: Response): ErrorResponse {
  const payload = res ? res.json() : {};
  return {
    status: res.status,
    code: payload.code,
    message: payload.message
  };
}
