import { createSelector } from 'reselect';
import { RootState } from '../store';
import { TaskStatusDataFields, TaskStatusIdsFields } from './tasksTypes';

const selectTasksSlice = (state: RootState) => state.tasks;

export const selectTaskIdsByField = (field: TaskStatusIdsFields) =>
  createSelector([selectTasksSlice], (tasksSlice) => tasksSlice[field]);

export const selectFilteredTaskIdsByField = (
  idsField: TaskStatusIdsFields,
  dataField: TaskStatusDataFields,
) =>
  createSelector(
    [selectTasksSlice, selectTasksDataByField(dataField)],
    (tasksSlice, tasksData) => {
      const searchQuery = tasksSlice.search.toLowerCase();

      return tasksSlice[idsField].filter((taskId) => {
        const task = tasksData[taskId];
        return (
          task.summary.toLowerCase().includes(searchQuery) ||
          task.id.toLowerCase().includes(searchQuery)
        );
      });
    },
  );

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

export const selectBoardTasksByColumnId = (columnId: string) =>
  createSelector(
    [selectBoardTaskIds, selectBoardTasksData],
    (boardTaskIds, boardTasksData) =>
      boardTaskIds.filter(
        (taskId) => boardTasksData[taskId]?.columnId === columnId,
      ),
  );
