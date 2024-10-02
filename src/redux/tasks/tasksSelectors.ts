import { createSelector } from 'reselect';
import { RootState } from '../store';
import { TaskStatusDataFields, TaskStatusIdsFields } from './tasksTypes';

const selectTasksSlice = (state: RootState) => state.tasks;

export const selectTaskIdsByField = (field: TaskStatusIdsFields) =>
  createSelector([selectTasksSlice], (tasksSlice) => tasksSlice[field]);

export const selectTasksDataByField = (field: TaskStatusDataFields) =>
  createSelector([selectTasksSlice], (tasksSlice) => tasksSlice[field]);

export const selectTaskByIdAndField = (
  field: TaskStatusDataFields,
  id: string,
) =>
  createSelector(
    [selectTasksDataByField(field)],
    (tasksByField) => tasksByField[id],
  );

export const selectBacklogTaskIds = createSelector(
  [selectTasksSlice],
  (tasksSlice) => tasksSlice.backlogTaskIds,
);

export const selectBoardTaskIds = createSelector(
  [selectTasksSlice],
  (tasksSlice) => tasksSlice.boardTaskIds,
);

export const selectBacklogTasksData = createSelector(
  [selectTasksSlice],
  (tasksSlice) => tasksSlice.backlogTasksData,
);

export const selectBoardTasksData = createSelector(
  [selectTasksSlice],
  (tasksSlice) => tasksSlice.boardTasksData,
);

export const selectBacklogTaskById = (taskId: string) =>
  createSelector(
    [selectBacklogTasksData],
    (backlogTasksData) => backlogTasksData[taskId],
  );

export const selectBoardTaskById = (taskId: string) =>
  createSelector(
    [selectBoardTasksData],
    (boardTasksData) => boardTasksData[taskId],
  );
