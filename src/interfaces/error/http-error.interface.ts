export interface HttpError {
  status: number;
  code: string;
  message: string;
  path: string;
  traceId: string;
}