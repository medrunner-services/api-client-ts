namespace MedrunnerApiClient.Models;

/// <summary>
/// Represents a team member.
/// </summary>
public class TeamMember
{
    /// <summary>
    /// The Discord ID of the team member.
    /// </summary>
    public string DiscordId { get; set; }

    /// <summary>
    /// The unique identifier for the team member.
    /// </summary>
    public string Id { get; set; }

    /// <summary>
    /// The RSI handle of the team member.
    /// </summary>
    public string? RsiHandle { get; set; }

    /// <summary>
    /// The class of the team member.
    /// </summary>
    public Class Class { get; set; }

    /// <summary>
    /// The team ID, if any.
    /// </summary>
    public string? TeamId { get; set; }
}
