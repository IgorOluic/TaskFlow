import {
  BACKLOG_TASKS_DATA,
  BACKLOG_TASK_IDS,
  BOARD_TASKS_DATA,
  BOARD_TASK_IDS,
  FILTERED_BACKLOG_TASK_IDS,
  FILTERED_BOARD_TASK_IDS,
} from '../../constants/tasks';

export enum TaskStatus {
  board = 'board',
  backlog = 'backlog',
}

export type TaskStatusIdsFields =
  | typeof BOARD_TASK_IDS
  | typeof BACKLOG_TASK_IDS;

export type TaskStatusFilteredIdsFields =
  | typeof FILTERED_BOARD_TASK_IDS
  | typeof FILTERED_BACKLOG_TASK_IDS;

export type TaskStatusDataFields =
  | typeof BOARD_TASKS_DATA
  | typeof BACKLOG_TASKS_DATA;

export type TaskStatusFields = Record<
  TaskStatus,
  {
    ids: TaskStatusIdsFields;
    data: TaskStatusDataFields;
    filteredIds: TaskStatusFilteredIdsFields;
  }
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
  filteredBacklogTaskIds: string[];
  backlogTasksData: BacklogTasksData;
  boardTaskIds: string[];
  filteredBoardTaskIds: string[];
  boardTasksData: BoardTasksData;
  search: string;
}
