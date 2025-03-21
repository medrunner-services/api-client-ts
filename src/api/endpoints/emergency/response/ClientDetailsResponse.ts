import { PersonType } from "../../../../models/Person";

export interface ClientDetailsResponse {
  totalEmergencies: number;
  emergencySuccessRate: number;
  joinDate: string;
  personType: PersonType;
  hasCitizenCon2954Promo: boolean;
}
