/**
 * Response data which is paginated and includes the data and a token to get the next page.
 * */
export default interface PaginatedResponse<T = unknown> {
  /**
   * The page of data returned by the request
   * */
  data: T[];

  /**
   * The pagination token to get the next page of data in a subsequent request
   * */
  paginationToken?: string;
}
