import { calculateNewTaskIndex } from '../src/utils/taskUtils';

describe('calculateNewTaskIndex', () => {
  it('should return the length of unfiltered ids when moving to an empty list', () => {
    const allTaskIds = ['task-1', 'task-2', 'task-3', 'task-4', 'task-5'];
    const filteredTaskIds: string[] = [];

    const droppedAtIndex = 0;
    const newIndex = calculateNewTaskIndex({
      filteredTaskIds,
      allTaskIds,
      droppedAtIndex,
    });

    expect(newIndex).toEqual(allTaskIds.length);
  });

  it('should return the unfiltered index of the next item when moving to the beggining of the list', () => {
    const allTaskIds = ['task-1', 'task-2', 'task-3', 'task-4', 'task-5'];
    const filteredTaskIds = ['task-2', 'task-3'];

    const droppedAtIndex = 0;
    const unfilteredIndexOfNextItem = 1; // task-2 in allTaskIds
    const newIndex = calculateNewTaskIndex({
      filteredTaskIds,
      allTaskIds,
      droppedAtIndex,
    });

    expect(newIndex).toEqual(unfilteredIndexOfNextItem);
  });

  it('should return the unfiltered index of previous item + 1 when moving somewhere in the middle of the list', () => {
    const allTaskIds = ['task-1', 'task-5', 'task-3', 'task-4', 'task-2'];
    const filteredTaskIds = ['task-1', 'task-3', 'task-2'];

    const droppedAtIndex = 2;
    const unfilteredIndexOfPreviousItem = 2 + 1; // task-3 in unfiltered list
    const newIndex = calculateNewTaskIndex({
      filteredTaskIds,
      allTaskIds,
      droppedAtIndex,
    });

    expect(newIndex).toEqual(unfilteredIndexOfPreviousItem);
  });

  it('should return the unfiltered index of previous item + 1 when moving to the end of the list', () => {
    const allTaskIds = ['task-1', 'task-3', 'task-4', 'task-2', 'task-5'];
    const filteredTaskIds = ['task-1', 'task-3', 'task-2'];

    const droppedAtIndex = filteredTaskIds.length;
    const unfilteredIndexOfPreviousItem = 3 + 1; // task-2 in unfiltered list

    const newIndex = calculateNewTaskIndex({
      filteredTaskIds,
      allTaskIds,
      droppedAtIndex,
    });

    expect(newIndex).toEqual(unfilteredIndexOfPreviousItem);
  });
});
