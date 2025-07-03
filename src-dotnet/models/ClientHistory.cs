namespace MedrunnerApiClient.Models;

/// <summary>
/// Represents a client's emergency history.
/// </summary>
public class ClientHistory : DbItem
{
    /// <summary>
    /// The emergency id associated with this history record.
    /// </summary>
    public string EmergencyId { get; set; }

    /// <summary>
    /// The client id associated with this history record.
    /// </summary>
    public string ClientId { get; set; }

    /// <summary>
    /// The timestamp when the emergency was created.
    /// </summary>
    public string EmergencyCreationTimestamp { get; set; }
}
