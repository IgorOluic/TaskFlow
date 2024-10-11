import { TaskStatus, TaskStatusFields } from '../redux/tasks/tasksTypes';

export const BOARD_TASK_IDS = 'boardTaskIds';
export const FILTERED_BOARD_TASK_IDS = 'filteredBoardTaskIds';
export const BACKLOG_TASK_IDS = 'backlogTaskIds';
export const FILTERED_BACKLOG_TASK_IDS = 'filteredBacklogTaskIds';

export const BOARD_TASKS_DATA = 'boardTasksData';
export const BACKLOG_TASKS_DATA = 'backlogTasksData';

export const TASK_STATUS_FIELDS: TaskStatusFields = {
  [TaskStatus.board]: {
    ids: 'boardTaskIds',
    data: 'boardTasksData',
  },
  [TaskStatus.backlog]: {
    ids: 'backlogTaskIds',
    data: 'backlogTasksData',
  },
};
