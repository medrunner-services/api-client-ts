namespace MedrunnerApiClient.Models;

/// <summary>
/// Represents a team that is responding to an emergency (inherits from <see cref="Team"/>).
/// </summary>
public class RespondingTeam : Team
{
    /// <summary>
    /// Gets or sets the unique identifier for the responding team.
    /// </summary>
    public string Id { get; set; }

    /// <summary>
    /// Gets or sets the name of the responding team.
    /// </summary>
    public string TeamName { get; set; }
}
