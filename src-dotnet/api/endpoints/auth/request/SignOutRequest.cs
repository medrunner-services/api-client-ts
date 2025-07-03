namespace MedrunnerApiClient.Api.Endpoints.Auth.Request
{
    /// <summary>
    /// Request body for sign-out.
    /// </summary>
    public class SignOutRequest
    {
        /// <summary>
        /// The refresh token to be invalidated
        /// </summary>
        public string RefreshToken { get; set; }
    }
}
