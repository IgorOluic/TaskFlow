import { RootState } from '../redux/store';
import {
  ITasksData,
  TaskIdsByColumn,
  TaskStatus,
} from '../redux/tasks/tasksTypes';

// Adding comments here to make it easier to understand

// Its important to keep track of the filtered and unfiltered lists, because for example:
// inserting an item as a first item of a filtered list, should not set it as the first item of an unfiltered list,
// it should only place it right before the next item

export const calculateNewTaskIndex = ({
  state,
  taskStatus,
  droppedAtIndex,
}: {
  state: RootState;
  taskStatus: TaskStatus;
  droppedAtIndex: number;
}) => {
  const filteredTaskIds = state.tasks[taskStatus].filteredTaskIds;
  const allTaskIds = state.tasks[taskStatus].taskIds;

  // Case when inserting to the beggining of the list
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

  // In all other cases there should be a previous item
  const previousId = filteredTaskIds[droppedAtIndex - 1];

  if (previousId) {
    const indexOfPreviousItem = allTaskIds.findIndex(
      (item) => item === previousId,
    );

    return indexOfPreviousItem + 1;
  }

  // Add this as a safety measure
  return allTaskIds.length;
};

export const recalculateFilteredTaskIdsByColumn = ({
  tasksData,
  filteredTaskIds,
}: {
  tasksData: ITasksData;
  filteredTaskIds: string[];
}): TaskIdsByColumn => {
  const idsByColumn: TaskIdsByColumn = {};

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
