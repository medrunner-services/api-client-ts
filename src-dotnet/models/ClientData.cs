namespace MedrunnerApiClient.Models;
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
