export enum TaskStatus {
  active = 'ACTIVE',
  backlog = 'BACKLOG',
}

export interface ITask {
  assignedTo: string | null;
  columnId: string;
  createdAt: string;
  description: string;
  id: string;
  status: TaskStatus;
  summary: string;
}

export type BacklogTasksData = Record<string, ITask>;

export interface ITasksState {
  tasks: ITask[];
  backlogTaskIds: string[];
  backlogTasksData: BacklogTasksData;
}
