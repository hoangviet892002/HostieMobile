export interface BaseReponse<T> {
  code: number;
  message: string;
  result: T;
  totalElements: number;
  totalPages: number;
}
