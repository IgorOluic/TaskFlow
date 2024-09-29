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

export interface IColumn {
  name: string;
  order: number;
  id: string;
  tasks: any[];
}

export interface IProjectsState {
  selectedProjectId: string | null;
  projects: IProjectWithOwnerDetails[];
  columns: IColumn[];
  loading: boolean;
  error: string | null;
  backlogTasks: any[];
}
