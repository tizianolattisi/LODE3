import { ErrorResponse } from './ErrorResponse';

export const NOT_FOUND_CODE = 'NotFoundError';

export class NotFoundResponse extends ErrorResponse {
  constructor() {
    super(NOT_FOUND_CODE, "Resource not found");
  }
}
