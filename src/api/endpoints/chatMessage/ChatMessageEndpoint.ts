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
   * Fetch a chat message
   *
   * @param id - The id of the message
   * @returns The chat message
   *
   * */
  public async getMessage(id: string): Promise<ApiResponse<ChatMessage>> {
    return await this.getRequest<ChatMessage>(id);
  }

  /**
   * Gets the specified amount of chat messages for a given emergency.
   *
   * @param emergencyId - The emergency for which to fetch the chat history
   * @param limit - The number of emergencies to get, max 100
   * @param paginationToken - The string to use for pagination
   * */
  public async getMessageHistory(
    emergencyId: string,
    limit: number,
    paginationToken?: string,
  ): Promise<ApiResponse<PaginatedResponse<ChatMessage>>> {
    return await this.getRequest<PaginatedResponse<ChatMessage>>(`/conversation/${emergencyId}`, {
      limit,
      paginationToken,
    });
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

  /**
   * Update a chat message
   *
   * @param id - The id of the message to update
   * @param contents - The new content of the message
   * @returns The updated chat message
   *
   * */
  public async updateMessage(id: string, contents: string): Promise<ApiResponse<ChatMessage>> {
    return await this.putRequest<ChatMessage>(id, { contents });
  }

  /**
   * Delete a chat message
   *
   * @param id - The id of the message to delete
   *
   * */
  public async deleteMessage(id: string): Promise<ApiResponse> {
    return await this.deleteRequest(id);
  }
}
