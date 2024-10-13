import {
  ITasksState,
  TaskIdsByColumn,
  TaskStatus,
} from '../redux/tasks/tasksTypes';

// Adding comments here to make it easier to understand

// Its important to keep track of the filtered and unfiltered lists, because for example:
// inserting an item as a first item of a filtered list, should not set it as the first item of an unfiltered list,
// it should only place it right before the next item

export const calculateNewTaskIndex = ({
  filteredTaskIds,
  allTaskIds,
  droppedAtIndex,
  isMovingDown = false,
}: {
  filteredTaskIds: string[];
  allTaskIds: string[];
  droppedAtIndex: number;
  isMovingDown?: boolean;
}) => {
  // If moving to the beginning
  if (droppedAtIndex === 0) {
    // Try to get the ID of the next item in the filtered list
    const nextId = filteredTaskIds[droppedAtIndex];

    if (nextId) {
      // If we fin the ID of the next item in the filtered list, we get its index from the unfiltered list
      const indexOfNextItem = allTaskIds.findIndex((item) => item === nextId);

      return indexOfNextItem;
    }

    // If there is no next item, it means the filtered list is empty,
    // in this case we put the item to the end of the unfiltered list
    return allTaskIds.length;
  }

  // Find the ID of the previous item in the filtered list
  // Adjust the index since the item is temporarily removed from its original spot
  const previousItemId =
    filteredTaskIds[droppedAtIndex - (isMovingDown ? 0 : 1)];

  const globalIndexOfPreviousItem = allTaskIds.findIndex(
    (item) => item === previousItemId,
  );

  return globalIndexOfPreviousItem + (isMovingDown ? 0 : 1);
};

export const recalculateFilteredTaskIdsByColumn = ({
  state,
  status,
}: {
  state: ITasksState;
  status: TaskStatus;
}): TaskIdsByColumn => {
  const idsByColumn: TaskIdsByColumn = {};
  const { filteredTaskIds, tasksData } = state[status];

  filteredTaskIds.forEach((taskId) => {
    const taskData = tasksData[taskId];
    const { columnId } = taskData;

    if (!idsByColumn[columnId]) {
      idsByColumn[columnId] = [];
    }

    idsByColumn[columnId].push(taskId);
  });

  return idsByColumn;
};

export const resortFilteredTasks = ({
  state,
  status,
}: {
  state: ITasksState;
  status: TaskStatus;
}): {
  sortedFilteredTaskIds: string[];
  sortedFilteredIdsByColumn: TaskIdsByColumn;
} => {
  const sortedFilteredIdsByColumn: TaskIdsByColumn = {};

  const { taskIds, filteredTaskIds, tasksData } = state[status];

  // Create a map for taskIds to quickly find the index of a task
  const taskIndexMap = taskIds.reduce(
    (map, taskId, index) => {
      map[taskId] = index;
      return map;
    },
    {} as Record<string, number>,
  );

  // Sort filteredTaskIds based on their position in taskIds
  const sortedFilteredTaskIds = [...filteredTaskIds].sort(
    (a, b) => taskIndexMap[a] - taskIndexMap[b],
  );

  // Group the sorted filtered tasks by their columnId
  sortedFilteredTaskIds.forEach((taskId) => {
    const { columnId } = tasksData[taskId];
    if (!sortedFilteredIdsByColumn[columnId]) {
      sortedFilteredIdsByColumn[columnId] = [];
    }
    sortedFilteredIdsByColumn[columnId].push(taskId);
  });

  return { sortedFilteredTaskIds, sortedFilteredIdsByColumn };
};
