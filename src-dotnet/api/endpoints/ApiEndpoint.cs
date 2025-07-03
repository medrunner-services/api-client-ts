namespace MedrunnerApiClient.Api.Endpoints;

    /// <summary>
    /// Base class for API endpoints.
    /// </summary>
    public abstract class ApiEndpoint
    {
        protected readonly ApiConfig Config;
        protected readonly TokenManager TokenManager;
        protected readonly ILogger Logger;
        private readonly HttpClient _httpClient;

        protected ApiEndpoint(ApiConfig config, TokenManager tokenManager, ILogger logger, HttpClient? httpClient = null)
        {
            Config = config;
            TokenManager = tokenManager;
            Logger = logger;
            _httpClient = httpClient ?? new HttpClient();
        }

        /// <summary>
        /// Returns the endpoint path (to be implemented by derived classes).
        /// </summary>
        protected abstract string Endpoint { get; }

        /// <summary>
        /// Returns the full endpoint URL.
        /// </summary>
        protected string EndpointUrl() => $"{Config.BaseUrl.TrimEnd('/')}/{Endpoint.TrimStart('/')}";

        /// <summary>
        /// Builds the full URL for a request.
        /// </summary>
        protected string BuildUrl(string endpoint)
        {
            var baseUrl = EndpointUrl();
            if (baseUrl.EndsWith("/") && endpoint.StartsWith("/"))
                return baseUrl + endpoint.Substring(1);
            if (baseUrl.EndsWith("/") || endpoint.StartsWith("/"))
                return baseUrl + endpoint;
            return baseUrl + "/" + endpoint;
        }

        /// <summary>
        /// Adds headers for a request, including authentication if needed.
        /// </summary>
        protected virtual async Task<HttpRequestMessage> CreateRequestMessageAsync(HttpMethod method, string url, bool noAuthentication = false, object? body = null)
        {
            var request = new HttpRequestMessage(method, url);
            if (!noAuthentication)
            {
                var accessToken = await TokenManager.GetAccessTokenAsync("API makeRequest");
                if (!string.IsNullOrEmpty(accessToken))
                    request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            }
            if (body != null)
            {
                var json = System.Text.Json.JsonSerializer.Serialize(body);
                request.Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
            }
            return request;
        }

        /// <summary>
        /// Sends a GET request.
        /// </summary>
        protected async Task<ApiResponse<T>> GetRequestAsync<T>(string endpoint, Dictionary<string, object>? queryParams = null, bool noAuthentication = false)
        {
            var url = BuildUrl(endpoint);
            if (queryParams != null && queryParams.Count > 0)
            {
                var query = string.Join("&", queryParams.Select(kv => $"{kv.Key}={Uri.EscapeDataString(kv.Value?.ToString() ?? "")}"));
                url += (url.Contains("?") ? "&" : "?") + query;
            }
            var request = await CreateRequestMessageAsync(HttpMethod.Get, url, noAuthentication);
            return await SendRequestAsync<T>(request, "GET", url);
        }

        /// <summary>
        /// Sends a POST request.
        /// </summary>
        protected async Task<ApiResponse<T>> PostRequestAsync<T>(string endpoint, object? data = null, bool noAuthentication = false)
        {
            var url = BuildUrl(endpoint);
            var request = await CreateRequestMessageAsync(HttpMethod.Post, url, noAuthentication, data);
            return await SendRequestAsync<T>(request, "POST", url);
        }

        /// <summary>
        /// Sends a PUT request.
        /// </summary>
        protected async Task<ApiResponse<T>> PutRequestAsync<T>(string endpoint, object? data = null, bool noAuthentication = false)
        {
            var url = BuildUrl(endpoint);
            var request = await CreateRequestMessageAsync(HttpMethod.Put, url, noAuthentication, data);
            return await SendRequestAsync<T>(request, "PUT", url);
        }

        /// <summary>
        /// Sends a PATCH request.
        /// </summary>
        protected async Task<ApiResponse<T>> PatchRequestAsync<T>(string endpoint, object? data = null, bool noAuthentication = false)
        {
            var url = BuildUrl(endpoint);
            var request = await CreateRequestMessageAsync(new HttpMethod("PATCH"), url, noAuthentication, data);
            return await SendRequestAsync<T>(request, "PATCH", url);
        }

        /// <summary>
        /// Sends a DELETE request.
        /// </summary>
        protected async Task<ApiResponse<T>> DeleteRequestAsync<T>(string endpoint, Dictionary<string, object>? queryParams = null, bool noAuthentication = false)
        {
            var url = BuildUrl(endpoint);
            if (queryParams != null && queryParams.Count > 0)
            {
                var query = string.Join("&", queryParams.Select(kv => $"{kv.Key}={Uri.EscapeDataString(kv.Value?.ToString() ?? "")}"));
                url += (url.Contains("?") ? "&" : "?") + query;
            }
            var request = await CreateRequestMessageAsync(HttpMethod.Delete, url, noAuthentication);
            return await SendRequestAsync<T>(request, "DELETE", url);
        }

        /// <summary>
        /// Sends the HTTP request and handles the response and errors.
        /// </summary>
        private async Task<ApiResponse<T>> SendRequestAsync<T>(HttpRequestMessage request, string method, string url)
        {
            Logger.Log($"sending {method} request to {url}");
            try
            {
                using var response = await _httpClient.SendAsync(request);
                var content = await response.Content.ReadAsStringAsync();
                if (response.IsSuccessStatusCode)
                {
                    var data = System.Text.Json.JsonSerializer.Deserialize<T>(content);
                    return new ApiResponse<T> { Success = true, Data = data };
                }
                else
                {
                    Logger.Log($"Error for {method} request to {url}: {content}");
                    return new ApiResponse<T> { Success = false, ErrorMessage = content, StatusCode = (int)response.StatusCode };
                }
            }
            catch (Exception ex)
            {
                Logger.Log($"Exception for {method} request to {url}: {ex.Message}");
                return new ApiResponse<T> { Success = false, ErrorMessage = ex.Message };
            }
        }
    }
    