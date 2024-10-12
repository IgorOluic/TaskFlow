import { createSelector } from 'reselect';
import { RootState } from '../store';
import { TaskStatus } from './tasksTypes';

const selectTasksSlice = (state: RootState) => state.tasks;

export const selectTaskIds = (status: TaskStatus) =>
  createSelector(
    [selectTasksSlice],
    (tasksSlice) => tasksSlice[status].taskIds,
  );

export const selectFilteredTaskIds = (status: TaskStatus) =>
  createSelector(
    [selectTasksSlice],
    (tasksSlice) => tasksSlice[status].filteredTaskIds,
  );

export const selectTasksDataByStatus = (status: TaskStatus) =>
  createSelector([selectTasksSlice], (tasksSlice) => tasksSlice[status]);

export const selectTaskByStatusAndId = (status: TaskStatus, id: string) =>
  createSelector(
    [selectTasksDataByStatus(status)],
    (tasksByField) => tasksByField.tasksData[id],
  );

export const selectColumnFilteredTaskIds = (
  status: TaskStatus,
  columnId: string,
) =>
  createSelector(
    [selectTasksDataByStatus(status)],
    (tasksByField) => tasksByField.filteredTaskIdsByColumn[columnId] ?? [],
  );
