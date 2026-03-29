export enum TaskStatus {
  board = 'board',
  backlog = 'backlog',
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

export type ITasksData = Record<string, ITask>;
export type TaskIdsByColumn = Record<string, string[]>;

export interface TaskStatusData {
  taskIds: string[];
  filteredTaskIds: string[];
  taskIdsByColumn: TaskIdsByColumn;
  filteredTaskIdsByColumn: TaskIdsByColumn;
  taskFilters: TaskFilters;
}

export enum TaskFilterTypes {
  SEARCH = 'search',
}

export type TaskFilters = Record<TaskFilterTypes, string | null>;
export interface ITasksState {
  initialLoadInProgress: boolean;
  tasksData: ITasksData;
  backlog: TaskStatusData;
  board: TaskStatusData;
}
