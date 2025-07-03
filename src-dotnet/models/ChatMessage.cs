namespace MedrunnerApiClient.Models;

/// <summary>
/// Represents a chat message.
/// </summary>
public class ChatMessage : DbItem
{
    /// <summary>
    /// The emergency associated with the chat message.
    /// </summary>
    public string EmergencyId { get; set; }

    /// <summary>
    /// The user id of the message sender.
    /// </summary>
    public string SenderId { get; set; }

    /// <summary>
    /// The timestamp at which the message was sent in Unix seconds.
    /// </summary>
    public long MessageSentTimestamp { get; set; }

    /// <summary>
    /// The contents of the message.
    /// </summary>
    public string Content { get; set; }
}
