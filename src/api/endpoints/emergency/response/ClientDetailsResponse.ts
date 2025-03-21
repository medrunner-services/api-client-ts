import { PersonType } from "../../../../models/Person";

export default interface ClientDetailsResponse {
  totalEmergencies: number;
  emergencySuccessRate: number;
  joinDate: string;
  personType: PersonType;
  hasCitizenCon2954Promo: boolean;
}
