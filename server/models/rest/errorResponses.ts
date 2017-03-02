export class ErrorResponse {
    private code: string;
    private message: string;

    constructor(code: string, message: string) {
        this.code = code;
        this.message = message;
    }
}

export class NotAuthenticatedResponse extends ErrorResponse {
    constructor() {
        super(NOT_AUTH_CODE, "Not authenticated");
    }
}

export class NotFoundResponse extends ErrorResponse {
    constructor() {
        super(NOT_FOUND_CODE, "Resource not found");
    }
}


export const NOT_AUTH_CODE = 'UnauthorizedError';
export const NOT_FOUND_CODE = 'NotFoundError';