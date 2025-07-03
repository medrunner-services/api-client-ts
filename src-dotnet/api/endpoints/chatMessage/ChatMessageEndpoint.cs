namespace MedrunnerApiClient.Api.Endpoints.ChatMessage
{
    /// <summary>
    /// Endpoints for interacting with chat messages.
    /// </summary>
    public class ChatMessageEndpoint : ApiEndpoint
    {
        public ChatMessageEndpoint(ApiConfig config, TokenManager tokenManager, ILogger logger)
            : base(config, tokenManager, logger)
        {
        }

        protected override string Endpoint => "chatMessage";

        /// <summary>
        /// Fetch a chat message by id.
        /// </summary>
        public async Task<ApiResponse<Models.ChatMessage>> GetMessageAsync(string id)
        {
            return await GetRequestAsync<Models.ChatMessage>(id);
        }

        /// <summary>
        /// Gets the specified amount of chat messages for a given emergency.
        /// </summary>
        public async Task<ApiResponse<Api.PaginatedResponse<Models.ChatMessage>>> GetMessageHistoryAsync(string emergencyId, int limit, string? paginationToken = null)
        {
            var queryParams = new Dictionary<string, object> { { "limit", limit } };
            if (!string.IsNullOrEmpty(paginationToken))
                queryParams["paginationToken"] = paginationToken;
            return await GetRequestAsync<Api.PaginatedResponse<Models.ChatMessage>>($"/conversation/{emergencyId}", queryParams);
        }

        /// <summary>
        /// Sends a new chat message.
        /// </summary>
        public async Task<ApiResponse<Models.ChatMessage>> SendMessageAsync(object message)
        {
            return await PostRequestAsync<Models.ChatMessage>("", message);
        }

        /// <summary>
        /// Update a chat message.
        /// </summary>
        public async Task<ApiResponse<Models.ChatMessage>> UpdateMessageAsync(string id, string contents)
        {
            var payload = new { contents };
            return await PutRequestAsync<Models.ChatMessage>(id, payload);
        }

        /// <summary>
        /// Delete a chat message.
        /// </summary>
        public async Task<ApiResponse<string>> DeleteMessageAsync(string id)
        {
            return await DeleteRequestAsync<string>(id);
        }
    }
}
