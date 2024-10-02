import { IUserData } from '../auth/authTypes';

export interface IProject {
  createdAt: string;
  description: string;
  id: string;
  name: string;
  owner: string;
  key: string;
  iconUrl: string | null;
  defaultIconId: number | null;
}

export interface IProjectWithOwnerDetails extends IProject {
  ownerDetails: IUserData;
}

export interface IProjectsState {
  projects: IProjectWithOwnerDetails[];
  selectedProjectId: string | null;
  selectedProjectData: IProjectWithOwnerDetails | null;
}
