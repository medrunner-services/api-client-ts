namespace MedrunnerApiClient.Models;

/// <summary>
/// Base class for DB items.
/// </summary>
public class DbItem
{
    /// <summary>
    /// The unique identifier for the item.
    /// </summary>
    public string Id { get; set; }

    /// <summary>
    /// The creation timestamp.
    /// </summary>
    public string Created { get; set; }

    /// <summary>
    /// The last updated timestamp.
    /// </summary>
    public string Updated { get; set; }
}
