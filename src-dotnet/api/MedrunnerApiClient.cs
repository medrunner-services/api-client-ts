namespace MedrunnerApiClient.Api;
using System;
using MedrunnerApiClient.Models;
/// <summary>
/// An API client for basic client interactions with the Medrunner API.
/// </summary>
public class MedrunnerApiClient
{
    public EmergencyEndpoint Emergency { get; }
    public ClientEndpoint Client { get; }
    public StaffEndpoint Staff { get; }
    public OrgSettingsEndpoint OrgSettings { get; }
    public ChatMessageEndpoint ChatMessage { get; }
    public CodeEndpoint Code { get; }
    public AuthEndpoint Auth { get; }
    public WebsocketEndpoint Websocket { get; }

    protected MedrunnerApiClient(
        EmergencyEndpoint emergency,
        ClientEndpoint client,
        StaffEndpoint staff,
        OrgSettingsEndpoint orgSettings,
        ChatMessageEndpoint chatMessage,
        CodeEndpoint code,
        AuthEndpoint auth,
        WebsocketEndpoint websocket)
    {
        Emergency = emergency;
        Client = client;
        Staff = staff;
        OrgSettings = orgSettings;
        ChatMessage = chatMessage;
        Code = code;
        Auth = auth;
        Websocket = websocket;
    }

    /// <summary>
    /// Constructs a new API client.
    /// </summary>
    public static MedrunnerApiClient BuildClient(ApiConfig config, Action<TokenGrant>? refreshCallback = null, ILogger? log = null)
    {
        var configWithDefaults = new DefaultApiConfig(config);
        var tokenManager = new TokenManager(configWithDefaults, refreshCallback, log);
        return new MedrunnerApiClient(
            new EmergencyEndpoint(configWithDefaults, tokenManager, log),
            new ClientEndpoint(configWithDefaults, tokenManager, log),
            new StaffEndpoint(configWithDefaults, tokenManager, log),
            new OrgSettingsEndpoint(configWithDefaults, tokenManager, log),
            new ChatMessageEndpoint(configWithDefaults, tokenManager, log),
            new CodeEndpoint(configWithDefaults, tokenManager, log),
            new AuthEndpoint(configWithDefaults, tokenManager, log),
            new WebsocketEndpoint(configWithDefaults, tokenManager, log)
        );
    }
}
