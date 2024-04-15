export default interface EmergencyStats {
  success: number;
  failed: number;
  noContact: number;
  refused: number;
  aborted: number;
  serverError: number;
  canceled: number;
}
