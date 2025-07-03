namespace MedrunnerApiClient.Api.Endpoints.Client
{
    /// <summary>
    /// Endpoints for interacting with clients.
    /// </summary>
    public class ClientEndpoint : ApiEndpoint
    {
        public ClientEndpoint(ApiConfig config, TokenManager tokenManager, ILogger logger)
            : base(config, tokenManager, logger)
        {
        }

        protected override string Endpoint => "client";

        /// <summary>
        /// Gets the current client.
        /// </summary>
        public async Task<ApiResponse<Models.Person>> GetAsync()
        {
            return await GetRequestAsync<Models.Person>("");
        }

        /// <summary>
        /// Gets the specified amount of emergencies the client has created.
        /// </summary>
        public async Task<ApiResponse<Api.PaginatedResponse<Models.ClientHistory>>> GetHistoryAsync(int limit, string? paginationToken = null)
        {
            var queryParams = new Dictionary<string, object> { { "limit", limit } };
            if (!string.IsNullOrEmpty(paginationToken))
                queryParams["paginationToken"] = paginationToken;
            return await GetRequestAsync<Api.PaginatedResponse<Models.ClientHistory>>("/history", queryParams);
        }

        /// <summary>
        /// Gets the blocklist status of the current client.
        /// </summary>
        public async Task<ApiResponse<string>> GetBlockedStatusAsync()
        {
            return await GetRequestAsync<string>("/blocked");
        }

        /// <summary>
        /// Links the current user to a rsiHandle.
        /// </summary>
        public async Task<ApiResponse<Models.Person>> LinkClientAsync(string rsiHandle)
        {
            var payload = new { rsiHandle };
            return await PostRequestAsync<Models.Person>("/link", payload);
        }

        /// <summary>
        /// Updates the settings of the current user for the Client Portal.
        /// </summary>
        public async Task<ApiResponse<string>> SetUserSettingsAsync(string settings)
        {
            var payload = new { settingsBlob = settings };
            return await PutRequestAsync<string>("/settings/clientPortal", payload);
        }

        /// <summary>
        /// Deactivate the current client.
        /// </summary>
        public async Task<ApiResponse<string>> DeactivateAsync()
        {
            return await DeleteRequestAsync<string>("");
        }
    }
}
