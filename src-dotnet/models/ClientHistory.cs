namespace MedrunnerApiClient.Models
{
    // Represents a client's history
    public class ClientHistory
    {
        public string ClientId { get; set; }
        public int MissionsCompleted { get; set; }
        public int MissionsCancelled { get; set; }
        // Add other properties as needed
    }
}
