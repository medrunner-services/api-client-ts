namespace MedrunnerApiClient.Api.Endpoints.Auth
{
    /// <summary>
    /// Represents the authentication endpoint.
    /// </summary>
    public class AuthEndpoint : ApiEndpoint
    {
        public AuthEndpoint(ApiConfig config, TokenManager tokenManager, ILogger logger)
            : base(config, tokenManager, logger)
        {
        }

        protected override string Endpoint => "auth";

        /// <summary>
        /// Invalidate a refresh token.
        /// </summary>
        /// <param name="oldToken">Token to be invalidated</param>
        public async Task<ApiResponse<string>> SignOutAsync(SignOutRequest? oldToken = null)
        {
            return await PostRequestAsync<string>("/signOut", oldToken);
        }

        /// <summary>
        /// Gets all API tokens for the user.
        /// </summary>
        public async Task<ApiResponse<List<ApiToken>>> GetApiTokensAsync()
        {
            return await GetRequestAsync<List<ApiToken>>("/apiTokens");
        }

        /// <summary>
        /// Creates an API token.
        /// </summary>
        /// <param name="newToken">Details for the new API token</param>
        /// <returns>The newly-created API token</returns>
        public async Task<ApiResponse<string>> CreateApiTokenAsync(CreateApiTokenRequest newToken)
        {
            var payload = new
            {
                name = newToken.Name,
                expirationDate = newToken.ExpirationDate?.ToString("o")
            };
            return await PostRequestAsync<string>("/apiTokens", payload);
        }

        /// <summary>
        /// Delete an API token.
        /// </summary>
        /// <param name="id">The id of the API token to delete</param>
        public async Task<ApiResponse<string>> DeleteApiTokenAsync(string id)
        {
            return await DeleteRequestAsync<string>($"/apiTokens/{id}");
        }
    }
}
