import DbItem from "./DbItem";

export default interface ChatMessage extends DbItem {
  /**
   * The emergency associated with the chat message
   * */
  emergencyId: string;

  /**
   * The user id of the message sender
   * */
  senderId: string;

  /**
   * The timestamp at which the message was sent in Unix seconds
   * */
  messageSentTimestamp: number;

  /**
   * The contents of the message
   * */
  contents: string;
}
