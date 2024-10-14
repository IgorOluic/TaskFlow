import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  runTransaction,
  updateDoc,
  getDoc,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { ITask, ITasksState, TaskStatus } from './tasksTypes';
import { parseTasksData, parseTasksData2 } from '../../utils/dataUtils';
import actions from '../../constants/actions';
import { RootState } from '../store';
import {
  calculateNewTaskIndex,
  calculateNewTaskIndexInColumns,
  recalculateFilteredTaskIdsByColumn,
  resortFilteredTasks,
} from '../../utils/taskUtils';
import taskServices from '../../services/taskServices';

// TODO: Choosing where to create a task: backlog/board
export const createTask = createAsyncThunk(
  actions.createTask,
  async (
    {
      projectId,
      columnId,
      summary,
      description,
      assignee,
    }: {
      projectId: string;
      columnId?: string | null;
      summary: string;
      description: string;
      assignee: string | null;
    },
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState() as RootState;
      const projectKey = state.projects.selectedProjectData?.key;

      if (!projectKey) {
        throw new Error('Cannot find the project key.');
      }

      const projectRef = doc(db, `projects/${projectId}`);
      const taskOrderRef = doc(db, `projects/${projectId}/taskOrders/backlog`);
      let taskId;

      await runTransaction(db, async (transaction) => {
        const projectDoc = await transaction.get(projectRef);
        const taskOrderDoc = await transaction.get(taskOrderRef);

        if (!projectDoc.exists()) {
          throw new Error('Project does not exist');
        }

        const taskCounter = projectDoc.data().taskCounter || 1;

        // Generate the new task ID in the format projectKey-number
        taskId = `${projectKey}-${taskCounter}`;

        transaction.update(projectRef, { taskCounter: taskCounter + 1 });

        const tasksRef = doc(db, `projects/${projectId}/tasks/${taskId}`);
        const newTask = {
          summary,
          description,
          id: taskId,
          columnId: columnId || null,
          createdAt: new Date().toISOString(),
          status: TaskStatus.backlog,
          assignedTo: assignee,
        };

        transaction.set(tasksRef, newTask);

        if (taskOrderDoc.exists()) {
          const taskOrderData = taskOrderDoc.data().taskOrder || [];

          const newTaskOrder = [taskId, ...taskOrderData];

          transaction.update(taskOrderRef, { taskOrder: newTaskOrder });
        } else {
          transaction.set(taskOrderRef, { taskOrder: [taskId] });
        }
      });

      return {
        id: taskId,
        summary,
        description,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error creating task:', error);
      return rejectWithValue('Failed to create task');
    }
  },
);

export const fetchBacklogTasks = createAsyncThunk(
  actions.fetchBacklogTasks,
  async ({ projectId }: { projectId: string }, { rejectWithValue }) => {
    try {
      const tasksRef = collection(db, `projects/${projectId}/tasks`);

      const q = query(tasksRef, where('status', '==', TaskStatus.backlog));

      const querySnapshot = await getDocs(q);

      const taskOrderRef = doc(db, `projects/${projectId}/taskOrders/backlog`);
      const taskOrderSnapshot = await getDoc(taskOrderRef);

      let sortedTaskIds = [];
      if (taskOrderSnapshot.exists()) {
        sortedTaskIds = taskOrderSnapshot.data().taskOrder || [];
      }

      const { data, idsByColumn } = parseTasksData(
        querySnapshot.docs as QueryDocumentSnapshot<ITask>[],
        sortedTaskIds,
      );

      return { sortedTaskIds, data, idsByColumn };
    } catch (error) {
      console.error('Error fetching backlog tasks:', error);
      return rejectWithValue('Failed to fetch backlog tasks');
    }
  },
);

export const fetchBoardTasks = createAsyncThunk(
  actions.fetchBoardTasks,
  async ({ projectId }: { projectId: string }, { rejectWithValue }) => {
    try {
      const tasksRef = collection(db, `projects/${projectId}/tasks`);

      const q = query(tasksRef, where('status', '==', TaskStatus.board));

      const querySnapshot = await getDocs(q);

      const taskOrderRef = doc(db, `projects/${projectId}/taskOrders/board`);
      const taskOrderSnapshot = await getDoc(taskOrderRef);

      let sortedTaskIds = [];
      if (taskOrderSnapshot.exists()) {
        sortedTaskIds = taskOrderSnapshot.data().taskOrder || [];
      }

      const { data, idsByColumn } = parseTasksData(
        querySnapshot.docs as QueryDocumentSnapshot<ITask>[],
        sortedTaskIds,
      );

      return { sortedTaskIds, data, idsByColumn };
    } catch (error) {
      console.error('Error fetching backlog tasks:', error);
      return rejectWithValue('Failed to fetch backlog tasks');
    }
  },
);

export const fetchTasks = createAsyncThunk(
  actions.fetchTasks,
  async ({ projectId }: { projectId: string }, { rejectWithValue }) => {
    try {
      const tasksRef = collection(db, `projects/${projectId}/tasks`);

      const tasksQuery = query(tasksRef);

      const querySnapshot = await getDocs(tasksQuery);

      const backlogOrderRef = doc(
        db,
        `projects/${projectId}/taskOrders/backlog`,
      );
      const boardOrderRef = doc(db, `projects/${projectId}/taskOrders/board`);

      const [backlogOrderSnapshot, boardOrderSnapshot] = await Promise.all([
        getDoc(backlogOrderRef),
        getDoc(boardOrderRef),
      ]);

      let backlogSortedTaskIds: string[] = [];
      let boardSortedTaskIds: string[] = [];

      if (backlogOrderSnapshot.exists()) {
        backlogSortedTaskIds = backlogOrderSnapshot.data().taskOrder || [];
      }

      if (boardOrderSnapshot.exists()) {
        boardSortedTaskIds = boardOrderSnapshot.data().taskOrder || [];
      }

      const { data, backlogIdsByColumn, boardIdsByColumn } = parseTasksData2(
        querySnapshot.docs as QueryDocumentSnapshot<ITask>[],
        backlogSortedTaskIds,
        boardSortedTaskIds,
      );

      return {
        data,
        backlogSortedTaskIds,
        backlogIdsByColumn,
        boardSortedTaskIds,
        boardIdsByColumn,
      };
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return rejectWithValue('Failed to fetch tasks');
    }
  },
);

export const moveTaskToColumn = createAsyncThunk(
  actions.moveTaskToColumn,
  async (
    {
      taskId,
      newColumnId,
      taskStatus,
    }: { taskId: string; newColumnId: string; taskStatus: TaskStatus },
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState() as RootState;
      const projectId = state.projects.selectedProjectId;
      const taskRef = doc(db, `projects/${projectId}/tasks/${taskId}`);

      await updateDoc(taskRef, {
        columnId: newColumnId,
      });

      return { taskId, newColumnId, taskStatus };
    } catch (error) {
      console.error('Error moving task to new column:', error);
      return rejectWithValue('Failed to move task to new column');
    }
  },
);

export const setTaskAssignee = createAsyncThunk(
  actions.setTaskAssignee,
  async (
    {
      taskId,
      newAssigneeId,
    }: {
      taskId: string;
      newAssigneeId: string | null;
    },
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState() as RootState;
      const projectId = state.projects.selectedProjectId;
      const taskRef = doc(db, `projects/${projectId}/tasks/${taskId}`);

      await updateDoc(taskRef, { assignedTo: newAssigneeId });

      return { taskId, newAssigneeId };
    } catch (error) {
      console.error('Error setting task assignee:', error);
      return rejectWithValue('Failed to set task assignee');
    }
  },
);

export const reorderTaskPosition = createAsyncThunk(
  actions.updateTaskPosition,
  async (
    {
      taskId,
      droppedAtIndex,
      taskStatus,
      isMovingDown,
    }: {
      taskId: string;
      droppedAtIndex: number;
      taskStatus: TaskStatus;
      isMovingDown: boolean;
    },
    { rejectWithValue, getState, dispatch },
  ) => {
    try {
      const state = getState() as RootState;

      const newIndex = calculateNewTaskIndex({
        filteredTaskIds: state.tasks[taskStatus].filteredTaskIds,
        allTaskIds: state.tasks[taskStatus].taskIds,
        droppedAtIndex,
        isMovingDown,
      });

      dispatch(
        reorderTaskPositionLocally({
          taskId,
          newIndex,
          taskStatus,
        }),
      );

      const projectId = state.projects.selectedProjectId;

      if (!projectId) {
        throw new Error('Project ID not found.');
      }

      await taskServices.reorderTaskPosition({
        projectId,
        taskId,
        newIndex,
        taskStatus,
      });
    } catch (error) {
      console.error('Error updating task position:', error);
      return rejectWithValue('Failed to update task position');
    }
  },
);

export const reorderTaskPositionInColumn = createAsyncThunk(
  actions.reorderTaskPositionInColumn,
  async (
    {
      taskId,
      droppedAtIndex,
      taskStatus,
      isMovingDown = false,
      columnId,
    }: {
      taskId: string;
      droppedAtIndex: number;
      taskStatus: TaskStatus;
      isMovingDown?: boolean;
      columnId: string;
    },
    { rejectWithValue, getState, dispatch },
  ) => {
    try {
      const state = getState() as RootState;

      const newIndex = calculateNewTaskIndexInColumns({
        allTaskIdsByColumn: state.tasks[taskStatus].taskIdsByColumn,
        filteredTaskIdsByColumn:
          state.tasks[taskStatus].filteredTaskIdsByColumn,
        allTaskIds: state.tasks[taskStatus].taskIds,
        droppedAtIndex,
        isMovingDown,
        columnId,
      });

      if (newIndex !== null) {
        dispatch(
          reorderTaskPositionLocally({
            taskId,
            newIndex: newIndex,
            taskStatus,
          }),
        );

        const projectId = state.projects.selectedProjectId;

        if (!projectId) {
          throw new Error('Project ID not found.');
        }

        await taskServices.reorderTaskPosition({
          projectId,
          taskId,
          newIndex,
          taskStatus,
        });
      }
    } catch (error) {
      console.error('Error updating task position:', error);
      return rejectWithValue('Failed to update task position');
    }
  },
);

export const updateTaskColumnAndPosition = createAsyncThunk(
  actions.updateTaskColumnAndPosition,
  async (
    {
      taskId,
      droppedAtIndex,
      taskStatus,
      isMovingDown = false,
      oldColumnId,
      newColumnId,
    }: {
      taskId: string;
      droppedAtIndex: number;
      taskStatus: TaskStatus;
      isMovingDown?: boolean;
      oldColumnId: string;
      newColumnId: string;
    },
    { rejectWithValue, getState, dispatch },
  ) => {
    try {
      const state = getState() as RootState;

      const newIndex = calculateNewTaskIndexInColumns({
        allTaskIdsByColumn: state.tasks[taskStatus].taskIdsByColumn,
        filteredTaskIdsByColumn:
          state.tasks[taskStatus].filteredTaskIdsByColumn,
        allTaskIds: state.tasks[taskStatus].taskIds,
        droppedAtIndex,
        isMovingDown,
        columnId: newColumnId,
      });

      dispatch(
        updateTaskColumnAndPositionLocally({
          taskId,
          newIndex,
          taskStatus,
          oldColumnId,
          newColumnId,
        }),
      );
      const projectId = state.projects.selectedProjectId;
      if (!projectId) {
        throw new Error('Project ID not found.');
      }

      if (newIndex === null) {
        await taskServices.updateTaskColumn({
          projectId,
          taskId,
          columnId: newColumnId,
        });
      } else {
        await taskServices.updateTaskColumnAndPosition({
          projectId,
          taskId,
          newIndex,
          taskStatus,
          columnId: newColumnId,
        });
      }
    } catch (error) {
      console.error('Error updating task position:', error);
      return rejectWithValue('Failed to update task position');
    }
  },
);

export const updateTaskStatusAndPosition = createAsyncThunk(
  actions.updateTaskStatusAndPosition,
  async (
    {
      taskId,
      newStatus,
      oldStatus,
      droppedAtIndex,
    }: {
      taskId: string;
      newStatus: TaskStatus;
      oldStatus: TaskStatus;
      droppedAtIndex: number;
    },
    { rejectWithValue, dispatch, getState },
  ) => {
    try {
      const state = getState() as RootState;

      const newIndex = calculateNewTaskIndex({
        filteredTaskIds: state.tasks[newStatus].filteredTaskIds,
        allTaskIds: state.tasks[newStatus].taskIds,
        droppedAtIndex,
        isMovingDown: false,
      });

      dispatch(
        updateTaskStatusAndPositionLocally({
          taskId,
          newStatus,
          oldStatus,
          newIndex,
        }),
      );

      const projectId = state.projects.selectedProjectId;

      if (!projectId) {
        throw new Error('Project ID not found.');
      }

      await taskServices.updateTaskStatusAndPosition({
        projectId,
        taskId,
        oldStatus: oldStatus,
        newStatus: newStatus,
        newIndex,
      });
    } catch (error) {
      console.error('Error updating task status and position:', error);
      return rejectWithValue('Failed to update task status and position');
    }
  },
);

const initialState: ITasksState = {
  tasksData: {},
  backlog: {
    taskIds: [],
    filteredTaskIds: [],
    taskIdsByColumn: {},
    filteredTaskIdsByColumn: {},
  },
  board: {
    taskIds: [],
    filteredTaskIds: [],
    taskIdsByColumn: {},
    filteredTaskIdsByColumn: {},
  },
};

const tasksSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    filterTasks: (
      state,
      action: PayloadAction<{
        search: string | null;
        statusesToFilter: TaskStatus[];
      }>,
    ) => {
      const { search, statusesToFilter } = action.payload;

      if (!search) {
        // TODO: At the moment this resets the filters when the search is cleared,
        // needs to be updated when user filters are implemented
        statusesToFilter.forEach((status) => {
          state[status].filteredTaskIds = state[status].taskIds;
          state[status].filteredTaskIdsByColumn =
            recalculateFilteredTaskIdsByColumn({
              state,
              status,
            });
        });
      } else {
        const searchQuery = search.toLowerCase();

        statusesToFilter.forEach((status) => {
          state[status].filteredTaskIds = state[status].taskIds.filter(
            (taskId) => {
              const task = state.tasksData[taskId];
              return (
                task.summary.toLowerCase().includes(searchQuery) ||
                task.id.toLowerCase().includes(searchQuery)
              );
            },
          );

          state[status].filteredTaskIdsByColumn =
            recalculateFilteredTaskIdsByColumn({
              state,
              status,
            });
        });
      }
    },
    updateTaskStatusAndPositionLocally: (
      state,
      action: PayloadAction<{
        taskId: string;
        newStatus: TaskStatus;
        oldStatus: TaskStatus;
        newIndex: number;
      }>,
    ) => {
      const { taskId, newStatus, oldStatus, newIndex } = action.payload;

      // TODO: This works for now but needs to be improved/easier to look at

      // Update task status
      state.tasksData[taskId] = {
        ...state.tasksData[taskId],
        status: newStatus,
      };

      // Remove the taskId from old status ids and filteredIds
      const oldTaskIds = state[oldStatus].taskIds;
      const oldFilteredTaskIds = state[oldStatus].filteredTaskIds;

      const taskIndexInOldIds = oldTaskIds.indexOf(taskId);
      if (taskIndexInOldIds !== -1) {
        oldTaskIds.splice(taskIndexInOldIds, 1);
      }

      const taskIndexInOldFilteredIds = oldFilteredTaskIds.indexOf(taskId);
      if (taskIndexInOldFilteredIds !== -1) {
        oldFilteredTaskIds.splice(taskIndexInOldFilteredIds, 1);
      }

      // Only recalculate filteredTaskIdsByColumn if necessary
      if (taskIndexInOldIds !== -1 || taskIndexInOldFilteredIds !== -1) {
        state[oldStatus].filteredTaskIdsByColumn =
          recalculateFilteredTaskIdsByColumn({
            state,
            status: oldStatus,
          });
      }

      // Add the taskId to new status ids and filteredIds at the correct newIndex
      const newTaskIds = state[newStatus].taskIds;
      newTaskIds.splice(newIndex, 0, taskId); // Modify array in place

      const newFilteredTaskIds = state[newStatus].filteredTaskIds;
      newFilteredTaskIds.push(taskId); // Add taskId to filtered list

      // Sort filteredTaskIds by their position in taskIds array
      newFilteredTaskIds.sort((a, b) => {
        return newTaskIds.indexOf(a) - newTaskIds.indexOf(b);
      });

      // Recalculate filteredTaskIdsByColumn for the new status
      state[newStatus].filteredTaskIdsByColumn =
        recalculateFilteredTaskIdsByColumn({
          state,
          status: newStatus,
        });
    },
    updateTaskColumnAndPositionLocally: (
      state,
      action: PayloadAction<{
        taskId: string;
        taskStatus: TaskStatus;
        newIndex: number | null;
        oldColumnId: string;
        newColumnId: string;
      }>,
    ) => {
      const { taskId, newIndex, taskStatus, newColumnId } = action.payload;

      // Update task column
      state.tasksData[taskId] = {
        ...state.tasksData[taskId],
        columnId: newColumnId,
      };

      const currentIndex = state[taskStatus].taskIds.indexOf(taskId);

      if (currentIndex !== -1) {
        // If new index is null, we don't need to update it's position
        if (newIndex !== null) {
          const updatedTaskIds = [
            ...state[taskStatus].taskIds.slice(0, currentIndex),
            ...state[taskStatus].taskIds.slice(currentIndex + 1),
          ];

          // Adjust the newIndex if the item was moved to a larger unfiltered index
          const adjustedNewIndex =
            newIndex > currentIndex ? newIndex - 1 : newIndex;

          // Insert the taskId at the adjusted newIndex
          updatedTaskIds.splice(adjustedNewIndex, 0, taskId);
          state[taskStatus].taskIds = updatedTaskIds;
        }

        const { sortedFilteredTaskIds, sortedFilteredIdsByColumn } =
          resortFilteredTasks({
            state,
            status: taskStatus,
          });

        state[taskStatus].filteredTaskIds = sortedFilteredTaskIds;
        state[taskStatus].filteredTaskIdsByColumn = sortedFilteredIdsByColumn;
      }
    },
    reorderTaskPositionLocally: (
      state,
      action: PayloadAction<{
        taskId: string;
        newIndex: number;
        taskStatus: TaskStatus;
      }>,
    ) => {
      const { taskId, newIndex, taskStatus } = action.payload;

      const currentIndex = state[taskStatus].taskIds.indexOf(taskId);

      if (currentIndex !== -1) {
        state[taskStatus].taskIds.splice(currentIndex, 1);
        state[taskStatus].taskIds.splice(newIndex, 0, taskId);

        const { sortedFilteredTaskIds, sortedFilteredIdsByColumn } =
          resortFilteredTasks({
            state,
            status: taskStatus,
          });

        state[taskStatus].filteredTaskIds = sortedFilteredTaskIds;
        state[taskStatus].filteredTaskIdsByColumn = sortedFilteredIdsByColumn;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasksData = action.payload.data;
      state.backlog = {
        taskIds: action.payload.backlogSortedTaskIds,
        filteredTaskIds: action.payload.backlogSortedTaskIds,
        taskIdsByColumn: action.payload.backlogIdsByColumn,
        filteredTaskIdsByColumn: action.payload.backlogIdsByColumn,
      };
      state.board = {
        taskIds: action.payload.boardSortedTaskIds,
        filteredTaskIds: action.payload.boardSortedTaskIds,
        taskIdsByColumn: action.payload.boardIdsByColumn,
        filteredTaskIdsByColumn: action.payload.boardIdsByColumn,
      };
    });
    builder.addCase(moveTaskToColumn.fulfilled, (state, action) => {
      state.tasksData[action.payload.taskId] = {
        ...state.tasksData[action.payload.taskId],
        columnId: action.payload.newColumnId,
      };

      state[action.payload.taskStatus].filteredTaskIdsByColumn =
        recalculateFilteredTaskIdsByColumn({
          state,
          status: action.payload.taskStatus,
        });
    });
    builder.addCase(setTaskAssignee.fulfilled, (state, action) => {
      state.tasksData[action.payload.taskId] = {
        ...state.tasksData[action.payload.taskId],
        assignedTo: action.payload.newAssigneeId,
      };
    });
  },
});

export const {
  updateTaskStatusAndPositionLocally,
  updateTaskColumnAndPositionLocally,
  reorderTaskPositionLocally,
  filterTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
