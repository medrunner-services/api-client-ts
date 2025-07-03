namespace MedrunnerApiClient.Models
{
    // Represents a chat message
    public class ChatMessage
    {
        public string Id { get; set; }
        public string Content { get; set; }
        public string SenderId { get; set; }
        public long Timestamp { get; set; }
        // Add other properties as needed
    }
}
