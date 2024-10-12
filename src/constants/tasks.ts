import { TaskStatus, TaskStatusFields } from '../redux/tasks/tasksTypes';

export const BOARD_TASK_IDS = 'boardTaskIds';
export const FILTERED_BOARD_TASK_IDS = 'filteredBoardTaskIds';
export const BOARD_TASKS_DATA = 'boardTasksData';

export const BACKLOG_TASK_IDS = 'backlogTaskIds';
export const FILTERED_BACKLOG_TASK_IDS = 'filteredBacklogTaskIds';
export const BACKLOG_TASKS_DATA = 'backlogTasksData';

export const TASK_STATUS_FIELDS: TaskStatusFields = {
  [TaskStatus.board]: {
    ids: BOARD_TASK_IDS,
    filteredIds: FILTERED_BOARD_TASK_IDS,
    data: BOARD_TASKS_DATA,
  },
  [TaskStatus.backlog]: {
    ids: BACKLOG_TASK_IDS,
    filteredIds: FILTERED_BACKLOG_TASK_IDS,
    data: BACKLOG_TASKS_DATA,
  },
};
