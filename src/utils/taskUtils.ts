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

export const calculateNewTaskIndexInColumns = ({
  filteredTaskIdsByColumn,
  allTaskIdsByColumn,
  allTaskIds,
  droppedAtIndex,
  isMovingDown = false,
  columnId,
}: {
  filteredTaskIdsByColumn: TaskIdsByColumn;
  allTaskIdsByColumn: TaskIdsByColumn;
  allTaskIds: string[];
  droppedAtIndex: number;
  isMovingDown?: boolean;
  columnId: string;
}) => {
  // If moving to the beginning
  if (droppedAtIndex === 0) {
    if (filteredTaskIdsByColumn[columnId]) {
      // Try to get the ID of the next item in the filtered column list
      const nextId = filteredTaskIdsByColumn[columnId][droppedAtIndex];

      if (nextId) {
        // If we find the ID of the next item in the filtered list, we get its index from the unfiltered list
        const indexOfNextItem = allTaskIds.findIndex((item) => item === nextId);
        return indexOfNextItem;
      }
    }

    // If there is no next item, try to find the last item from the columns unfiltered list
    if (allTaskIdsByColumn[columnId]) {
      const lastIdInColumn =
        allTaskIdsByColumn[columnId][allTaskIdsByColumn[columnId].length - 1];

      if (lastIdInColumn) {
        const indexOfLastItem = allTaskIds.findIndex(
          (item) => item === lastIdInColumn,
        );
        return indexOfLastItem + 1;
      }
    }

    // If there are no items at all in this column, we shouldn't change index at all
    return null;
  }

  const previousItemId =
    filteredTaskIdsByColumn[columnId][droppedAtIndex - (isMovingDown ? 0 : 1)];

  const globalIndexOfPreviousItem = allTaskIds.findIndex(
    (item) => item === previousItemId,
  );

  return globalIndexOfPreviousItem + (isMovingDown ? 0 : 1);
};

export const resortTasks = ({
  state,
  taskStatus,
}: {
  state: ITasksState;
  taskStatus: TaskStatus;
}) => {
  const { tasksData } = state;
  const { taskIds, filteredTaskIds } = state[taskStatus];

  const resortedFilteredTaskIds: string[] = [];
  const resortedTaskIdsByColumn: TaskIdsByColumn = {};
  const resortedFilteredTaskIdsByColumn: TaskIdsByColumn = {};

  taskIds.forEach((taskId) => {
    const task = tasksData[taskId];
    if (task) {
      const { columnId } = task;
      if (!resortedTaskIdsByColumn[columnId]) {
        resortedTaskIdsByColumn[columnId] = [];
      }
      resortedTaskIdsByColumn[columnId].push(taskId);

      if (filteredTaskIds.includes(taskId)) {
        resortedFilteredTaskIds.push(taskId);

        if (!resortedFilteredTaskIdsByColumn[columnId]) {
          resortedFilteredTaskIdsByColumn[columnId] = [];
        }
        resortedFilteredTaskIdsByColumn[columnId].push(taskId);
      }
    }
  });

  state[taskStatus].filteredTaskIds = resortedFilteredTaskIds;
  state[taskStatus].taskIdsByColumn = resortedTaskIdsByColumn;
  state[taskStatus].filteredTaskIdsByColumn = resortedFilteredTaskIdsByColumn;
};

export const removeTaskFromList = (taskIds: string[], taskId: string) => {
  const index = taskIds.indexOf(taskId);
  if (index !== -1) {
    taskIds.splice(index, 1);
  }
};

export const insertTaskAtIndex = (
  taskIds: string[],
  taskId: string,
  newIndex: number,
): void => {
  if (newIndex >= 0 && newIndex <= taskIds.length) {
    taskIds.splice(newIndex, 0, taskId); // Insert the taskId at the specified index
  }
};
