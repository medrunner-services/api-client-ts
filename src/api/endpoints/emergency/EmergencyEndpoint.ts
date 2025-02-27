import { Logger } from "ts-log";

import { HeaderProvider } from "../../../Func";
import { CancellationReason } from "../../../models/CancellationReason";
import Emergency from "../../../models/Emergency";
import { ResponseRating } from "../../../models/ResponseRating";
import ApiResponse from "../../ApiResponse";
import ApiEndpoint from "../ApiEndpoint";
import TokenManager from "../auth/TokenManager";
import DefaultApiConfig from "../DefaultApiConfig";
import CreateEmergencyRequest from "./request/CreateEmergencyRequest";
import LocationDetail from "./response/LocationDetail";
import TeamDetailsResponse from "./response/TeamDetailsResponse";

/**
 * Endpoints for interacting with emergencies.
 * */
export default class EmergencyEndpoint extends ApiEndpoint {
  constructor(config: DefaultApiConfig, tokenManager: TokenManager, log?: Logger, headerProvider?: HeaderProvider) {
    super(config, tokenManager, log, headerProvider);
  }

  protected override endpoint(): string {
    return "emergency";
  }

  /**
   * Gets an emergency by id.
   *
   * @param id - The id of the emergency to retrieve
   * */
  public async getEmergency(id: string): Promise<ApiResponse<Emergency>> {
    return await this.getRequest<Emergency>(`/${id}`);
  }

  /**
   * Bulk fetches emergencies by id.
   *
   * @param ids - a list of emergencies to retrieve
   * */
  public async getEmergencies(ids: string[]): Promise<ApiResponse<Emergency[]>> {
    return await this.getRequest<Emergency[]>(`/bulk?id=${ids.join("&id=")}`);
  }

  /**
   * Creates a new emergency.
   *
   * @param newEmergency - Emergency details for the new emergency
   * @returns The newly-created emergency
   *
   * */
  public async createEmergency(newEmergency: CreateEmergencyRequest): Promise<ApiResponse<Emergency>> {
    return await this.postRequest<Emergency>("", newEmergency);
  }

  /**
   * Cancels an existing emergency.
   *
   * @remarks
   * Emergency must still be in the {@link MissionStatus.RECEIVED} state in order to be canceled.
   *
   * @param id - The id of the emergency to cancel
   * @param reason - The reason the emergency was canceled
   * */
  public async cancelEmergencyWithReason(id: string, reason: CancellationReason): Promise<ApiResponse> {
    return await this.postRequest(`/${id}/cancelWithReason`, {
      reason: reason,
    });
  }

  /**
   * Allows the client to rate their emergency.
   *
   * @param id - The id of the emergency to rate
   * @param rating - The rating to give the services provided
   * @param remarks - Additional remarks provided by the client
   *
   * @internal
   * */
  public async rateServices(id: string, rating: ResponseRating, remarks?: string): Promise<ApiResponse> {
    return await this.postRequest(`/${id}/rate/`, {
      rating: rating,
      remarks: remarks,
    });
  }

  /**
   * Fetches additional details about the responding team for an alert.
   *
   * @param id - The id of the emergency to get team details about
   * */
  public async teamDetails(id: string): Promise<ApiResponse<TeamDetailsResponse>> {
    return await this.getRequest<TeamDetailsResponse>(`/${id}/teamDetails`);
  }
}
