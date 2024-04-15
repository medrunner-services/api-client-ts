/**
 * Request body for sign-out.
 * */
export default interface SignOutRequest {
  /**
   * The refresh token to be invalidated
   * */
  refreshToken: string;
}
