namespace MedrunnerApiClient.Api.Endpoints.Emergency;

    /// <summary>
    /// Endpoints for interacting with emergencies.
    /// </summary>
    public class EmergencyEndpoint : ApiEndpoint
    {
        public EmergencyEndpoint(ApiConfig config, TokenManager tokenManager, ILogger logger)
            : base(config, tokenManager, logger)
        {
        }

        protected override string Endpoint => "emergency";

        /// <summary>
        /// Gets an emergency by id.
        /// </summary>
        public async Task<ApiResponse<Models.Emergency>> GetEmergencyAsync(string id)
        {
            return await GetRequestAsync<Models.Emergency>($"/{id}");
        }

        /// <summary>
        /// Bulk fetches emergencies by id.
        /// </summary>
        public async Task<ApiResponse<List<Models.Emergency>>> GetEmergenciesAsync(List<string> ids)
        {
            var query = string.Join("&id=", ids);
            return await GetRequestAsync<List<Models.Emergency>>($"/bulk?id={query}");
        }

        /// <summary>
        /// Creates a new emergency.
        /// </summary>
        public async Task<ApiResponse<Models.Emergency>> CreateEmergencyAsync(Api.Endpoints.Emergency.Request.CreateEmergencyRequest newEmergency)
        {
            return await PostRequestAsync<Models.Emergency>("", newEmergency);
        }

        /// <summary>
        /// Cancels an existing emergency with a reason.
        /// </summary>
        public async Task<ApiResponse<string>> CancelEmergencyWithReasonAsync(string id, Models.CancellationReason reason)
        {
            var payload = new { reason = reason };
            return await PostRequestAsync<string>($"/{id}/cancelWithReason", payload);
        }

        /// <summary>
        /// Allows the client to rate their emergency.
        /// </summary>
        public async Task<ApiResponse<string>> RateServicesAsync(string id, Models.ResponseRating rating, string? remarks = null)
        {
            var payload = new { rating = rating, remarks = remarks };
            return await PostRequestAsync<string>($"/{id}/rate/", payload);
        }

        /// <summary>
        /// Fetches additional details about the responding team for an alert.
        /// </summary>
        public async Task<ApiResponse<Api.Endpoints.Emergency.Response.TeamDetailsResponse>> TeamDetailsAsync(string id)
        {
            return await GetRequestAsync<Api.Endpoints.Emergency.Response.TeamDetailsResponse>($"/{id}/teamDetails");
        }
    }
    