namespace MedrunnerApiClient.Models;

/// <summary>
/// Represents a deployment.
/// </summary>
public class Deployment
{
    /// <summary>
    /// The type of client for the deployment.
    /// </summary>
    public ClientType ClientType { get; set; }

    /// <summary>
    /// The version of the deployment.
    /// </summary>
    public string Version { get; set; }
}

/// <summary>
/// The type of client for the deployment.
/// </summary>
public enum ClientType
{
    CLIENT_PORTAL = 1,
    STAFF_PORTAL = 2
}
