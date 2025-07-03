namespace MedrunnerApiClient.Models;

/// <summary>
/// Represents a person in the system.
/// </summary>
public class Person : WritableDbItem
{
    /// <summary>
    /// The Discord ID of the person.
    /// </summary>
    public string DiscordId { get; set; }

    /// <summary>
    /// The RSI handle of the person.
    /// </summary>
    public string? RsiHandle { get; set; }

    /// <summary>
    /// The roles assigned to the person.
    /// </summary>
    public UserRoles Roles { get; set; }

    /// <summary>
    /// The type of person (client, staff, bot).
    /// </summary>
    public PersonType PersonType { get; set; }

    /// <summary>
    /// Whether the person is active.
    /// </summary>
    public bool Active { get; set; }

    /// <summary>
    /// The reason for deactivation.
    /// </summary>
    public AccountDeactivationReason DeactivationReason { get; set; }

    /// <summary>
    /// The client stats for the person.
    /// </summary>
    public ClientStats ClientStats { get; set; }

    /// <summary>
    /// The ID of the active emergency, if any.
    /// </summary>
    public string? ActiveEmergency { get; set; }

    /// <summary>
    /// @deprecated Use ClientPortalPreferencesBlob instead.
    /// </summary>
    public object ClientPortalPreferences { get; set; }

    /// <summary>
    /// @deprecated Fetch this information via client.getRedeemedCodes instead.
    /// </summary>
    public List<RedeemedCode> RedeemedCodes { get; set; }

    /// <summary>
    /// The client portal preferences blob.
    /// </summary>
    public string? ClientPortalPreferencesBlob { get; set; }

    /// <summary>
    /// Whether the person allows anonymous alerts.
    /// </summary>
    public bool AllowAnonymousAlert { get; set; }

    /// <summary>
    /// The initial join date.
    /// </summary>
    public string? InitialJoinDate { get; set; }
}
