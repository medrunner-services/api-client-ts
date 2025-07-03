namespace MedrunnerApiClient.Models;
/// <summary>
/// Represents an after action report for an emergency.
/// </summary>
public class AfterActionReport
{
    /// <summary>
    /// Remarks provided in the report.
    /// </summary>
    public string? Remarks { get; set; }

    /// <summary>
    /// The staff ID of the submitter.
    /// </summary>
    public string SubmitterStaffId { get; set; }

    /// <summary>
    /// The services provided during the mission.
    /// </summary>
    public MissionServices ServicesProvided { get; set; }

    /// <summary>
    /// Whether the mission was suspected to be a trap.
    /// </summary>
    public bool SuspectedTrap { get; set; }

    /// <summary>
    /// Whether the report has been edited.
    /// </summary>
    public bool HasBeenEdited { get; set; }

    /// <summary>
    /// The timestamp when the report was submitted.
    /// </summary>
    public long SubmittedOn { get; set; }

    /// <summary>
    /// The edit history of the report.
    /// </summary>
    public List<AfterActionReportEdit> EditHistory { get; set; }
}

/// <summary>
/// Represents an edit to an after action report.
/// </summary>
public class AfterActionReportEdit
{
    /// <summary>
    /// The staff ID of the editor.
    /// </summary>
    public string EditorStaffId { get; set; }

    /// <summary>
    /// The time of the edit.
    /// </summary>
    public long EditTime { get; set; }
}

/// <summary>
/// Enum for mission services provided.
/// </summary>
public enum MissionServices
{
    NONE = 0,
    PVE = 1 << 0,
    PVP = 1 << 1,
    REVIVED_HEALED = 1 << 2,
    HEALED_IN_SHIP = 1 << 3,
    EXTRACT_SAFE_ZONE = 1 << 4
}
