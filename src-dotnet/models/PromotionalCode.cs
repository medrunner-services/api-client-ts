namespace MedrunnerApiClient.Models;

/// <summary>
/// Represents a promotional code.
/// </summary>
public class PromotionalCode : WritableDbItem
{
    /// <summary>
    /// The ID of the redeemer.
    /// </summary>
    public string RedeemerId { get; set; }

    /// <summary>
    /// The type of code.
    /// </summary>
    public CodeType Type { get; set; }
}

/// <summary>
/// The type of promotional code.
/// </summary>
public enum CodeType
{
    Unknown,
    CitizenCon2954
}
