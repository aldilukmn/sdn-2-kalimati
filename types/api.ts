export interface ApiStatus {
  code: number;
  response: string;
  message: string;
}

export interface ApiResponse<T = any> {
  status?: ApiStatus;
  result?: T;
  data?: T;
}
