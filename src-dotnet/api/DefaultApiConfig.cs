namespace MedrunnerApiClient.Api
{
    /// <summary>
    /// Represents API config with defaults applied.
    /// </summary>
    public class DefaultApiConfig : ApiConfig
    {
        public DefaultApiConfig(ApiConfig config)
        {
            BaseUrl = string.IsNullOrEmpty(config.BaseUrl) ? "https://api.medrunner.space" : config.BaseUrl;
            AccessToken = config.AccessToken;
            RefreshToken = config.RefreshToken;
            CookieAuth = config.CookieAuth;
        }
    }
}
