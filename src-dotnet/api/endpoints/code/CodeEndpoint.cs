namespace MedrunnerApiClient.Api.Endpoints.Code;

    /// <summary>
    /// Endpoints for interacting with promotional codes.
    /// </summary>
    public class CodeEndpoint : ApiEndpoint
    {
        public CodeEndpoint(ApiConfig config, TokenManager tokenManager, ILogger logger)
            : base(config, tokenManager, logger)
        {
        }

        protected override string Endpoint => "code";

        /// <summary>
        /// Gets the redeemed codes for the current user.
        /// </summary>
        public async Task<ApiResponse<List<Models.PromotionalCode>>> GetRedeemedCodesAsync()
        {
            return await GetRequestAsync<List<Models.PromotionalCode>>("/redeemed");
        }

        /// <summary>
        /// Redeems the specified promotional code for the current user.
        /// </summary>
        public async Task<ApiResponse<string>> RedeemAsync(string code)
        {
            return await PostRequestAsync<string>($"/redeem/{code}");
        }
    }
    