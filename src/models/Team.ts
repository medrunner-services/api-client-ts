import TeamMember from "./TeamMember";

export default interface Team {
  staff: TeamMember[];
  dispatchers: TeamMember[];
  allMembers: TeamMember[];
  maxMembers: number;
}
