import { ErrorResponse } from './ErrorResponse';

export const NOT_AUTH_CODE = 'UnauthorizedError';

export class NotAuthenticatedResponse extends ErrorResponse {
  constructor() {
    super(NOT_AUTH_CODE, "Not authenticated");
  }
}

