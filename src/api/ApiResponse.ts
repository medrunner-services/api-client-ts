export default interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  errorMessage?: string;
  statusCode?: number;
}
