namespace MedrunnerApiClient.Models
{
    // Represents emergency statistics
    public class EmergencyStats
    {
        public int TotalEmergencies { get; set; }
        public int CompletedEmergencies { get; set; }
        public int CancelledEmergencies { get; set; }
        // Add other properties as needed
    }
}
