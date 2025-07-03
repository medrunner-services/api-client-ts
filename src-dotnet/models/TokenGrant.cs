namespace MedrunnerApiClient.Models
{
    // Represents a token grant
    public class TokenGrant
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public long ExpiresIn { get; set; }
    }
}
