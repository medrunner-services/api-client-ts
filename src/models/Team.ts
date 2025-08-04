import TeamMember from "./TeamMember";

export default interface Team {
  maxMembers: number;
  staff: TeamMember[];
  dispatchers: TeamMember[];
  allMembers: TeamMember[];
}
