import {
  BACKLOG_TASKS_DATA,
  BACKLOG_TASK_IDS,
  BOARD_TASKS_DATA,
  BOARD_TASK_IDS,
} from '../../constants/tasks';

export enum TaskStatus {
  active = 'ACTIVE',
  backlog = 'BACKLOG',
}

type TaskStatusIdsFields = typeof BOARD_TASK_IDS | typeof BACKLOG_TASK_IDS;
type TaskStatusDataFields = typeof BOARD_TASKS_DATA | typeof BACKLOG_TASKS_DATA;

export type TaskStatusFields = Record<
  TaskStatus,
  { ids: TaskStatusIdsFields; data: TaskStatusDataFields }
>;

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
export type BoardTasksData = Record<string, ITask>;

export interface ITasksState {
  tasks: ITask[];
  backlogTaskIds: string[];
  backlogTasksData: BacklogTasksData;
  boardTaskIds: string[];
  boardTasksData: BoardTasksData;
}
