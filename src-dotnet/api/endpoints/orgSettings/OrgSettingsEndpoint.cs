namespace MedrunnerApiClient.Api.Endpoints.OrgSettings;

    /// <summary>
    /// Endpoints for interacting with the public org settings.
    /// </summary>
    public class OrgSettingsEndpoint : ApiEndpoint
    {
        public OrgSettingsEndpoint(ApiConfig config, TokenManager tokenManager, ILogger logger)
            : base(config, tokenManager, logger)
        {
        }

        protected override string Endpoint => "orgSettings";

        /// <summary>
        /// Get the public org settings.
        /// </summary>
        public async Task<ApiResponse<Models.OrgSettings>> GetPublicSettingsAsync()
        {
            return await GetRequestAsync<Models.OrgSettings>("/public");
        }
    }
    