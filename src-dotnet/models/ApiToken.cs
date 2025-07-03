namespace MedrunnerApiClient.Models;

/// <summary>
/// Represents an API token.
/// </summary>
public class ApiToken : DbItem
{
    /// <summary>
    /// The user who created the token.
    /// </summary>
    public string UserId { get; set; }

    /// <summary>
    /// Human-readable name for the token, assigned by the user.
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// The timestamp at which the token will expire in Unix seconds.
    /// </summary>
    public long? ExpirationDate { get; set; }

    /// <summary>
    /// When the token was last used to generate a new access token, iso-8601 timestamp.
    /// </summary>
    public string? LastUsed { get; set; }
}
