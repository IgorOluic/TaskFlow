import { createSelector } from 'reselect';
import { RootState } from '../store';

const selectTasksSlice = (state: RootState) => state.tasks;

export const selectBacklogTaskIds = createSelector(
  [selectTasksSlice],
  (tasksSlice) => tasksSlice.backlogTaskIds,
);

export const selectBacklogTasksData = createSelector(
  [selectTasksSlice],
  (tasksSlice) => tasksSlice.backlogTasksData,
);

export const selectBacklogTaskById = (taskId: string) =>
  createSelector(
    [selectBacklogTasksData],
    (backlogTasksData) => backlogTasksData[taskId],
  );
