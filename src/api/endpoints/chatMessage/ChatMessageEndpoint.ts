import { Logger } from "ts-log";

import { HeaderProvider } from "../../../Func";
import ChatMessage from "../../../models/ChatMessage";
import ApiResponse from "../../ApiResponse";
import PaginatedResponse from "../../PaginatedResponse";
import ApiEndpoint from "../ApiEndpoint";
import TokenManager from "../auth/TokenManager";
import DefaultApiConfig from "../DefaultApiConfig";
import ChatMessageRequest from "./request/ChatMessageRequest";

/**
 * Endpoints for interacting with chat messages.
 * */
export default class ChatMessageEndpoint extends ApiEndpoint {
  constructor(config: DefaultApiConfig, tokenManager: TokenManager, log?: Logger, headerProvider?: HeaderProvider) {
    super(config, tokenManager, log, headerProvider);
  }

  protected override endpoint(): string {
    return "chatMessage";
  }

  /**
   * Gets the specified amount of chat messages for a given emergency.
   *
   * @param emergencyId - The emergency for which to fetch the chat history
   * @param limit - The number of emergencies to get
   * @param paginationToken - The number to use for pagination
   * */
  public async getHistory(
    emergencyId: string,
    limit: number,
    paginationToken?: string,
  ): Promise<ApiResponse<PaginatedResponse<ChatMessage>>> {
    return await this.getRequest<PaginatedResponse<ChatMessage>>(`/${emergencyId}`, { limit, paginationToken });
  }

  /**
   * Sends a new chat message
   *
   * @param message - The message to send
   * @returns The newly-created chat message
   *
   * */
  public async sendMessage(message: ChatMessageRequest): Promise<ApiResponse<ChatMessage>> {
    return await this.postRequest<ChatMessage>("", message);
  }
}
