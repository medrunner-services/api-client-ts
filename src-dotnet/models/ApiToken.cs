namespace MedrunnerApiClient.Models
{
    // Represents an API token
    public class ApiToken
    {
        public string Token { get; set; }
        public string Type { get; set; }
        public long Expiry { get; set; }
    }
}
