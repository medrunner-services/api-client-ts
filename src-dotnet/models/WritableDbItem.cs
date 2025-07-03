namespace MedrunnerApiClient.Models;

/// <summary>
/// Base class for DB items that can be written to.
/// </summary>
public class WritableDbItem : DbItem
{
    /// <summary>
    /// The last updated timestamp.
    /// </summary>
    public string Updated { get; set; }
}
