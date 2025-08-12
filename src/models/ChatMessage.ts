import WritableDbItem from "./WritableDbItem";

export default interface ChatMessage extends WritableDbItem {
  /**
   * The emergency associated with the chat message
   * */
  emergencyId: string;

  /**
   * The user id of the message sender
   * */
  senderId: string;

  /**
   * The contents of the message
   * */
  contents: string;

  /**
   * Whether the message has been edited
   * */
  edited: boolean;

  /**
   * Whether the message has been deleted
   * */
  deleted: boolean;
}
