namespace MedrunnerApiClient.Api.Endpoints.ChatMessage.Request
{
    /// <summary>
    /// Request body for creating a new chat message.
    /// </summary>
    public class ChatMessageRequest
    {
        /// <summary>
        /// The id of the emergency associated with the message
        /// </summary>
        public string EmergencyId { get; set; }

        /// <summary>
        /// The message contents
        /// </summary>
        public string Contents { get; set; }
    }
}
