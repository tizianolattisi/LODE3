export class ErrorResponse {
  constructor(public status: number, public code: string, public message: string) {}
}
