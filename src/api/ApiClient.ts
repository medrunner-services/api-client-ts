import AuthEndpoint from "./endpoints/auth/AuthEndpoint";
import ChatMessageEndpoint from "./endpoints/chatMessage/ChatMessageEndpoint";
import ClientEndpoint from "./endpoints/client/ClientEndpoint";
import EmergencyEndpoint from "./endpoints/emergency/EmergencyEndpoint";
import StaffEndpoint from "./endpoints/staff/StaffEndpoint";
import WebsocketEndpoint from "./endpoints/websocket/WebsocketEndpoint";

export default interface ApiClient<
  TEmergency extends EmergencyEndpoint = EmergencyEndpoint,
  TClient extends ClientEndpoint = ClientEndpoint,
  TStaff extends StaffEndpoint = StaffEndpoint,
  TChatMessage extends ChatMessageEndpoint = ChatMessageEndpoint,
  TAuth extends AuthEndpoint = AuthEndpoint,
  TWebsocket extends WebsocketEndpoint = WebsocketEndpoint,
> {
  emergency: TEmergency;

  client: TClient;

  staff: TStaff;

  chatMessage: TChatMessage;

  auth: TAuth;

  websocket: TWebsocket;
}
