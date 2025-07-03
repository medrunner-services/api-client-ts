namespace MedrunnerApiClient.Api.Endpoints.Staff
{
    /// <summary>
    /// Endpoints for interacting with staff.
    /// </summary>
    public class StaffEndpoint : ApiEndpoint
    {
        public StaffEndpoint(ApiConfig config, TokenManager tokenManager, ILogger logger)
            : base(config, tokenManager, logger)
        {
        }

        protected override string Endpoint => "staff";

        /// <summary>
        /// Gets detailed information about medals.
        /// </summary>
        public async Task<ApiResponse<List<Api.Endpoints.Staff.Response.MedalInformation>>> MedalsInformationAsync()
        {
            return await GetRequestAsync<List<Api.Endpoints.Staff.Response.MedalInformation>>("/meta/medals");
        }
    }
}
