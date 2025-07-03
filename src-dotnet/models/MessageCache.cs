namespace MedrunnerApiClient.Models;
/// <summary>
/// Represents a cached message reference.
/// </summary>
public class MessageCache
{
    /// <summary>
    /// The message ID.
    /// </summary>
    public string Id { get; set; }

    /// <summary>
    /// The channel ID.
    /// </summary>
    public string ChannelId { get; set; }
}
