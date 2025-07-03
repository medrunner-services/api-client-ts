using MedrunnerApiClient.Api.Endpoints.Auth;
using MedrunnerApiClient.Api.Endpoints.ChatMessage;
using MedrunnerApiClient.Api.Endpoints.Client;
using MedrunnerApiClient.Api.Endpoints.Code;
using MedrunnerApiClient.Api.Endpoints.Emergency;
using MedrunnerApiClient.Api.Endpoints.OrgSettings;
using MedrunnerApiClient.Api.Endpoints.Staff;
using MedrunnerApiClient.Api.Endpoints.Websocket;

namespace MedrunnerApiClient.Api
{
    /// <summary>
    /// Interface for the Medrunner API client.
    /// </summary>
    public interface IApiClient
    {
        EmergencyEndpoint Emergency { get; }
        ClientEndpoint Client { get; }
        StaffEndpoint Staff { get; }
        OrgSettingsEndpoint OrgSettings { get; }
        ChatMessageEndpoint ChatMessage { get; }
        CodeEndpoint Code { get; }
        AuthEndpoint Auth { get; }
        WebsocketEndpoint Websocket { get; }
    }
}
