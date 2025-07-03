namespace MedrunnerApiClient.Models;
/// <summary>
/// Enum for cancellation reasons.
/// </summary>
public enum CancellationReason
{
    NONE,
    OTHER,
    SUCCUMBED_TO_WOUNDS,
    SERVER_ERROR,
    RESPAWNED,
    RESCUED
}
