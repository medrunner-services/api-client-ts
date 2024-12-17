import { Logger } from "ts-log";

import { AsyncAction } from "../Func";
import TokenGrant from "../models/TokenGrant";
import ApiClient from "./ApiClient";
import ApiConfig from "./ApiConfig";
import AuthEndpoint from "./endpoints/auth/AuthEndpoint";
import TokenManager from "./endpoints/auth/TokenManager";
import ChatMessageEndpoint from "./endpoints/chatMessage/ChatMessageEndpoint";
import ClientEndpoint from "./endpoints/client/ClientEndpoint";
import CodeEndpoint from "./endpoints/code/CodeEndpoint";
import EmergencyEndpoint from "./endpoints/emergency/EmergencyEndpoint";
import OrgSettingsEndpoint from "./endpoints/orgSettings/OrgSettingsEndpoint";
import StaffEndpoint from "./endpoints/staff/StaffEndpoint";
import WebsocketEndpoint from "./endpoints/websocket/WebsocketEndpoint";

/**
 * An API client for basic client interactions with the Medrunner API.
 * */
export default class MedrunnerApiClient<
  TEmergency extends EmergencyEndpoint = EmergencyEndpoint,
  TClient extends ClientEndpoint = ClientEndpoint,
  TStaff extends StaffEndpoint = StaffEndpoint,
  TOrgSettings extends OrgSettingsEndpoint = OrgSettingsEndpoint,
  TChatMessage extends ChatMessageEndpoint = ChatMessageEndpoint,
  TCode extends CodeEndpoint = CodeEndpoint,
  TAuth extends AuthEndpoint = AuthEndpoint,
  TWebsocket extends WebsocketEndpoint = WebsocketEndpoint,
> implements ApiClient<TEmergency, TClient, TStaff, TOrgSettings, TChatMessage, TCode, TAuth, TWebsocket>
{
  protected constructor(
    public readonly emergency: TEmergency,
    public readonly client: TClient,
    public readonly staff: TStaff,
    public readonly orgSettings: TOrgSettings,
    public readonly chatMessage: TChatMessage,
    public readonly code: TCode,
    public readonly auth: TAuth,
    public readonly websocket: TWebsocket,
  ) {}

  /**
   * Constructs a new API client.
   *
   * @param config - The API configuration
   * @param refreshCallback - a callback function called whenever a refresh token exchange is performed
   * @param log - A logger which logs request details
   * */
  public static buildClient(
    config: ApiConfig,
    refreshCallback?: AsyncAction<TokenGrant>,
    log?: Logger,
  ): MedrunnerApiClient {
    const tokenManager = new TokenManager(config, refreshCallback, log);

    return new MedrunnerApiClient(
      new EmergencyEndpoint(config.baseUrl, tokenManager, log),
      new ClientEndpoint(config.baseUrl, tokenManager, log),
      new StaffEndpoint(config.baseUrl, tokenManager, log),
      new OrgSettingsEndpoint(config.baseUrl, tokenManager, log),
      new ChatMessageEndpoint(config.baseUrl, tokenManager, log),
      new CodeEndpoint(config.baseUrl, tokenManager, log),
      new AuthEndpoint(config.baseUrl, tokenManager, log),
      new WebsocketEndpoint(config.baseUrl, tokenManager, log),
    );
  }
}
