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
import { parseTasksData } from '../../utils/dataUtils';
import actions from '../../constants/actions';
import { RootState } from '../store';
import {
  calculateNewTaskIndex,
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
      taskStatus,
    }: {
      taskId: string;
      newAssigneeId: string | null;
      taskStatus: TaskStatus;
    },
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState() as RootState;
      const projectId = state.projects.selectedProjectId;
      const taskRef = doc(db, `projects/${projectId}/tasks/${taskId}`);

      await updateDoc(taskRef, { assignedTo: newAssigneeId });

      return { taskId, newAssigneeId, taskStatus };
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
  backlog: {
    tasksData: {},
    taskIds: [],
    filteredTaskIds: [],
    filteredTaskIdsByColumn: {},
  },
  board: {
    tasksData: {},
    taskIds: [],
    filteredTaskIds: [],
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
              const task = state[status].tasksData[taskId];
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

      // Remove the task data from old status data
      const removedTask = state[oldStatus].tasksData[taskId];
      delete state[oldStatus].tasksData[taskId];

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

      // Add the task data to the new status data, updating its status
      state[newStatus].tasksData[taskId] = {
        ...removedTask,
        status: newStatus,
      };

      // Recalculate filteredTaskIdsByColumn for the new status
      state[newStatus].filteredTaskIdsByColumn =
        recalculateFilteredTaskIdsByColumn({
          state,
          status: newStatus,
        });
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
    builder.addCase(fetchBacklogTasks.fulfilled, (state, action) => {
      state.backlog.tasksData = action.payload.data;
      state.backlog.taskIds = action.payload.sortedTaskIds;
      state.backlog.filteredTaskIds = action.payload.sortedTaskIds;
      state.backlog.filteredTaskIdsByColumn = action.payload.idsByColumn;
    });
    builder.addCase(fetchBoardTasks.fulfilled, (state, action) => {
      state.board.tasksData = action.payload.data;
      state.board.taskIds = action.payload.sortedTaskIds;
      state.board.filteredTaskIds = action.payload.sortedTaskIds;
      state.board.filteredTaskIdsByColumn = action.payload.idsByColumn;
    });
    builder.addCase(moveTaskToColumn.fulfilled, (state, action) => {
      state[action.payload.taskStatus].tasksData[action.payload.taskId] = {
        ...state[action.payload.taskStatus].tasksData[action.payload.taskId],
        columnId: action.payload.newColumnId,
      };

      state[action.payload.taskStatus].filteredTaskIdsByColumn =
        recalculateFilteredTaskIdsByColumn({
          state,
          status: action.payload.taskStatus,
        });
    });
    builder.addCase(setTaskAssignee.fulfilled, (state, action) => {
      state[action.payload.taskStatus].tasksData[action.payload.taskId] = {
        ...state[action.payload.taskStatus].tasksData[action.payload.taskId],
        assignedTo: action.payload.newAssigneeId,
      };
    });
  },
});

export const {
  updateTaskStatusAndPositionLocally,
  reorderTaskPositionLocally,
  filterTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
