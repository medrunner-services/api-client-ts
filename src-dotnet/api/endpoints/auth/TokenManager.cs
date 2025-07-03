using System;
using MedrunnerApiClient.Models;

namespace MedrunnerApiClient.Api.Endpoints.Auth
{
    /// <summary>
    /// Manages API tokens.
    /// </summary>
    public class TokenManager
    {
        private readonly ApiConfig _config;
        private readonly Action<TokenGrant>? _refreshCallback;
        private readonly ILogger _logger;

        public TokenManager(ApiConfig config, Action<TokenGrant>? refreshCallback, ILogger logger)
        {
            _config = config;
            _refreshCallback = refreshCallback;
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        private string? _accessToken;
        private string? _refreshToken;
        private DateTime? _accessTokenExpiration;
        private DateTime? _refreshTokenExpiration;
        private Task<TokenGrant>? _tokenFetchTask;

        public async Task<string?> GetAccessTokenAsync(string source = "unknown")
        {
            _logger.Log($"getAccessToken: New token requested from {source}");

            // TODO: Add cookieAuth/local storage logic if needed

            if (_accessToken != null && _accessTokenExpiration.HasValue)
            {
                var exp = new DateTimeOffset(_accessTokenExpiration.Value).ToUnixTimeSeconds();
                var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                if (exp > now)
                {
                    _logger.Log($"getAccessToken: {source} => Token valid and simply returned");
                    return _accessToken;
                }
            }

            if (_refreshToken == null)
            {
                _logger.Log($"getAccessToken: {source} => Missing refresh token, returning stored access token");
                return _accessToken;
            }

            if (_tokenFetchTask == null)
            {
                _logger.Log($"getAccessToken: {source} => No current token fetch, starting new fetch");
                _tokenFetchTask = FetchTokenAsync(_refreshToken, source);
            }

            try
            {
                _logger.Log($"getAccessToken: {source} => Waiting for token fetch to complete");
                var tokens = await _tokenFetchTask;
                _accessToken = tokens.AccessToken;
                _refreshToken = tokens.RefreshToken;
                _accessTokenExpiration = DateTime.UtcNow.AddSeconds(tokens.ExpiresIn); // Simplified
                // TODO: Set refreshTokenExpiration if available
                if (_refreshCallback != null)
                {
                    _logger.Log($"getAccessToken: {source} => Calling refresh callback with new tokens");
                    _refreshCallback(tokens);
                }
            }
            finally
            {
                _tokenFetchTask = null;
            }

            _logger.Log($"getAccessToken: {source} => Returning new access token");
            return _accessToken;
        }

        private async Task<TokenGrant> FetchTokenAsync(string? refreshToken, string source = "unknown")
        {
            _logger.Log($"getAccessToken: {source} => Fetching new tokens");
            var body = new { refreshToken = refreshToken };
            // This assumes you have a PostRequestAsync method available, or you can inject an endpoint for this
            // For now, throw NotImplementedException
            throw new NotImplementedException("Token exchange endpoint not implemented in TokenManager");
        }
    }
}
