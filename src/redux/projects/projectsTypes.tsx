export interface IProject {
  columns: string[];
  createdAt: string;
  description: string;
  id: string;
  members: string[];
  name: string;
  owner: string;
}

export interface IColumn {
  name: string;
  order: number;
  id: string;
  tasks: any[];
}

export interface IProjectsState {
  selectedProjectId: string | null;
  projects: IProject[];
  columns: IColumn[];
  loading: boolean;
  error: string | null;
  backlogTasks: any[];
}
