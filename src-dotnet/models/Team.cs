using System.Collections.Generic;

namespace MedrunnerApiClient.Models
{
    // Represents a team responding to an emergency
    public class Team
    {
        public string Id { get; set; }
        public string Name { get; set; }
        // Add other properties as needed
    }

    public class RespondingTeam : Team
    {
        // Add properties specific to responding teams if needed
    }
}
