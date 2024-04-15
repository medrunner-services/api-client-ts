/**
 * Request body for creating a new chat message.
 * */
export default interface ChatMessageRequest {
  /**
   * The id of the emergency associated with the message
   * */
  emergencyId: string;

  /**
   * The message contents
   * */
  contents: string;
}
