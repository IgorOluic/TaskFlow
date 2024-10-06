import { IUserData } from '../auth/authTypes';
import { IProject } from '../projects/projectsTypes';

export interface IProjectInvitation {
  createdAt: string;
  id: string;
  invitee: string;
  inviter: IUserData;
  inviterId: string;
  project: IProject;
  projectId: string;
}

export interface IInvitationsState {
  invitations: IProjectInvitation[];
}
