namespace MedrunnerApiClient.Api.Endpoints.Websocket;

    /// <summary>
    /// Endpoints for interacting with websocket/realtime updates.
    /// </summary>
    public class WebsocketEndpoint : ApiEndpoint
    {
        private readonly WebsocketManager _websocketManager;

        public WebsocketEndpoint(ApiConfig config, TokenManager tokenManager, ILogger logger)
            : base(config, tokenManager, logger)
        {
            _websocketManager = new WebsocketManager(config, tokenManager, logger);
        }

        protected override string Endpoint => "websocket";

        /// <summary>
        /// Gets realtime updates (establishes websocket connection).
        /// </summary>
        public async Task<object> InitializeAsync()
        {
            // Replace object with actual connection type if available
            return await _websocketManager.EstablishConnectionAsync();
        }
    }
    