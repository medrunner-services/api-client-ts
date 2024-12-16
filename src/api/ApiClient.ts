import AuthEndpoint from "./endpoints/auth/AuthEndpoint";
import ChatMessageEndpoint from "./endpoints/chatMessage/ChatMessageEndpoint";
import ClientEndpoint from "./endpoints/client/ClientEndpoint";
import CodeEndpoint from "./endpoints/code/CodeEndpoint";
import EmergencyEndpoint from "./endpoints/emergency/EmergencyEndpoint";
import OrgSettingsEndpoint from "./endpoints/orgSettings/OrgSettingsEndpoint";
import StaffEndpoint from "./endpoints/staff/StaffEndpoint";
import WebsocketEndpoint from "./endpoints/websocket/WebsocketEndpoint";

export default interface ApiClient<
  TEmergency extends EmergencyEndpoint = EmergencyEndpoint,
  TClient extends ClientEndpoint = ClientEndpoint,
  TStaff extends StaffEndpoint = StaffEndpoint,
  TChatMessage extends ChatMessageEndpoint = ChatMessageEndpoint,
  TCode extends CodeEndpoint = CodeEndpoint,
  TOrgSettings extends OrgSettingsEndpoint = OrgSettingsEndpoint,
  TAuth extends AuthEndpoint = AuthEndpoint,
  TWebsocket extends WebsocketEndpoint = WebsocketEndpoint,
> {
  emergency: TEmergency;

  client: TClient;

  staff: TStaff;

  chatMessage: TChatMessage;

  code: TCode;

  orgSettings: TOrgSettings;

  auth: TAuth;

  websocket: TWebsocket;
}
