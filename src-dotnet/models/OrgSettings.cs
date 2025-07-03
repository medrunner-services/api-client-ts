namespace MedrunnerApiClient.Models;

/// <summary>
/// Represents organization settings.
/// </summary>
public class OrgSettings : WritableDbItem
{
    /// <summary>
    /// The public organization settings.
    /// </summary>
    public PublicOrgSettings Public { get; set; }
}

/// <summary>
/// Represents the public organization settings.
/// </summary>
public class PublicOrgSettings
{
    public ServiceStatus Status { get; set; }
    public bool EmergenciesEnabled { get; set; }
    public bool AnonymousAlertsEnabled { get; set; }
    public bool RegistrationEnabled { get; set; }
    public MessageOfTheDay? MessageOfTheDay { get; set; }
    public LocationSettings LocationSettings { get; set; }
}

public class MessageOfTheDay
{
    public string Message { get; set; }
    public DateRange? DateRange { get; set; }
}

public class DateRange
{
    public string StartDate { get; set; }
    public string EndDate { get; set; }
}

public class LocationSettings
{
    public List<SpaceLocation> Locations { get; set; }
}

public class SpaceLocation
{
    public string Name { get; set; }
    public SpaceLocationType Type { get; set; }
    public List<SpaceLocation> Children { get; set; }
    public bool Enabled { get; set; }
}

public enum SpaceLocationType
{
    UNKNOWN = 0,
    SYSTEM = 1,
    PLANET = 2,
    MOON = 3
}

public enum ServiceStatus
{
    UNKNOWN = 0,
    HEALTHY = 1,
    SLIGHTLY_DEGRADED = 2,
    HEAVILY_DEGRADED = 3,
    OFFLINE = 4
}
