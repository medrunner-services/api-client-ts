using System;
using System.Collections.Generic;

namespace MedrunnerApiClient.Models
{
    /// <summary>
    /// Represents an emergency mission in the Medrunner system.
    /// </summary>
    public class Emergency : WritableDbItem
    {
        public string System { get; set; }
        public string Subsystem { get; set; }
        public string? TertiaryLocation { get; set; }
        public ThreatLevel ThreatLevel { get; set; }
        public string ClientRsiHandle { get; set; }
        public string? ClientDiscordId { get; set; }
        public string? ClientId { get; set; }
        public string SubscriptionTier { get; set; }
        public MissionStatus Status { get; set; }
        public MessageCache? AlertMessage { get; set; }
        public MessageCache? ClientMessage { get; set; }
        public MessageCache? CoordinationThread { get; set; }
        public MessageCache? AfterActionReportMessage { get; set; }
        public Team RespondingTeam { get; set; }
        public List<RespondingTeam> RespondingTeams { get; set; }
        public long CreationTimestamp { get; set; }
        public long? AcceptedTimestamp { get; set; }
        public long? CompletionTimestamp { get; set; }
        public ResponseRating Rating { get; set; }
        public string? RatingRemarks { get; set; }
        public bool Test { get; set; }
        public CancellationReason CancellationReason { get; set; }
        public string? RefusalReason { get; set; }
        public Origin Origin { get; set; }
        public ClientData? ClientData { get; set; }
        public bool IsComplete { get; set; }
        public string? MissionName { get; set; }
        public AfterActionReport? AfterActionReport { get; set; }
        public SubmissionSource SubmissionSource { get; set; }
    }

    /// <summary>
    /// Represents a cached message reference.
    /// </summary>
    public class MessageCache
    {
        public string Id { get; set; }
        public string ChannelId { get; set; }
    }

    /// <summary>
    /// Represents client data for an emergency.
    /// </summary>
    public class ClientData
    {
        public string RsiHandle { get; set; }
        public string RsiProfileLink { get; set; }
        public bool GotClientData { get; set; }
        public bool RedactedOrgOnProfile { get; set; }
        public bool Reported { get; set; }
    }
}
