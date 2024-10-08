import { IUserData } from '../auth/authTypes';

export interface IMember extends IUserData {
  role: string;
  userId: string;
  addedAt: string | null;
}

export type IMembersData = Record<string, IMember>;

export interface IMembersState {
  projectMembers: IMembersData;
  projectMemberIds: string[];
  assigneeSearch: string;
}
