import { createSelector } from 'reselect';
import { RootState } from '../store';
import { TaskStatus } from './tasksTypes';

const selectTasksSlice = (state: RootState) => state.tasks;

export const selectTaskIds = (status: TaskStatus) =>
  createSelector(
    [selectTasksSlice],
    (tasksSlice) => tasksSlice[status].taskIds,
  );

export const selectInitialLoadInProgress = createSelector(
  [selectTasksSlice],
  (tasksSlice) => tasksSlice.initialLoadInProgress,
);

export const selectFilteredTaskIds = (status: TaskStatus) =>
  createSelector(
    [selectTasksSlice],
    (tasksSlice) => tasksSlice[status].filteredTaskIds,
  );

export const selectTasksDataByStatus = (status: TaskStatus) =>
  createSelector([selectTasksSlice], (tasksSlice) => tasksSlice[status]);

export const selectTaskById = (id: string) =>
  createSelector([selectTasksSlice], (tasksSlice) => tasksSlice.tasksData[id]);

export const selectColumnFilteredTaskIds = (
  status: TaskStatus,
  columnId: string,
) =>
  createSelector(
    [selectTasksDataByStatus(status)],
    (tasksByField) => tasksByField.filteredTaskIdsByColumn[columnId] ?? [],
  );

export const selectTotalTaskCount = (status: TaskStatus) =>
  createSelector([selectTaskIds(status)], (taskIds) => taskIds.length);

export const selectFilteredTaskCount = (status: TaskStatus) =>
  createSelector(
    [selectFilteredTaskIds(status)],
    (filteredTaskIds) => filteredTaskIds.length,
  );

export const selectColumnTaskCount = (status: TaskStatus, columnId: string) =>
  createSelector(
    [selectTasksSlice],
    (tasksSlice) =>
      tasksSlice[status].filteredTaskIdsByColumn[columnId]?.length ?? 0,
  );
