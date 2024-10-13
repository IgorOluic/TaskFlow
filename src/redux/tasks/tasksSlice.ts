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
} from '../../utils/taskUtils';

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
        state,
        droppedAtIndex,
        taskStatus: newStatus,
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

      const taskOrderRefOld = doc(
        db,
        `projects/${projectId}/taskOrders/${oldStatus}`,
      );
      const taskOrderRefNew = doc(
        db,
        `projects/${projectId}/taskOrders/${newStatus}`,
      );

      const taskRef = doc(db, `projects/${projectId}/tasks/${taskId}`);

      await runTransaction(db, async (transaction) => {
        const oldOrderDoc = await transaction.get(taskOrderRefOld);
        const newOrderDoc = await transaction.get(taskOrderRefNew);

        const oldOrder = oldOrderDoc.exists()
          ? (oldOrderDoc.data().taskOrder as string[])
          : [];

        const newOrder = newOrderDoc.exists()
          ? (newOrderDoc.data().taskOrder as string[])
          : [];

        const oldIndex = oldOrder.indexOf(taskId);
        if (oldIndex > -1) {
          oldOrder.splice(oldIndex, 1);
        }

        newOrder.splice(newIndex, 0, taskId);

        transaction.update(taskRef, {
          status: newStatus,
          updatedAt: new Date().toISOString(),
        });

        transaction.set(
          taskOrderRefOld,
          { taskOrder: oldOrder },
          { merge: true },
        );
        transaction.set(
          taskOrderRefNew,
          { taskOrder: newOrder },
          { merge: true },
        );
      });
    } catch (error) {
      console.error('Error updating task status and position:', error);
      return rejectWithValue('Failed to update task status and position');
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

export const updateTaskPosition = createAsyncThunk(
  actions.updateTaskPosition,
  async (
    {
      taskId,
      droppedAtIndex,
      taskStatus,
    }: {
      taskId: string;
      droppedAtIndex: number;
      taskStatus: TaskStatus;
    },
    { rejectWithValue, getState, dispatch },
  ) => {
    try {
      const state = getState() as RootState;

      const newIndex = calculateNewTaskIndex({
        state,
        taskStatus,
        droppedAtIndex,
      });

      dispatch(
        updateTaskPositionLocally({
          taskId,
          newIndex,
          taskStatus,
        }),
      );

      const projectId = state.projects.selectedProjectId;

      if (!projectId) {
        throw new Error('Project ID not found.');
      }

      const taskOrderRef = doc(
        db,
        `projects/${projectId}/taskOrders/${taskStatus}`,
      );

      await runTransaction(db, async (transaction) => {
        const taskOrderDoc = await transaction.get(taskOrderRef);

        if (!taskOrderDoc.exists()) {
          throw new Error('Task order document does not exist');
        }

        const taskOrder = taskOrderDoc.data().taskOrder as string[];

        const currentIndex = taskOrder.indexOf(taskId);

        if (currentIndex === -1) {
          throw new Error('Task ID not found in task order');
        }

        taskOrder.splice(currentIndex, 1);
        taskOrder.splice(newIndex, 0, taskId);

        transaction.update(taskOrderRef, { taskOrder });
      });
    } catch (error) {
      console.error('Error updating task position:', error);
      return rejectWithValue('Failed to update task position');
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
    filterAllTasks: (state, action: PayloadAction<string | null>) => {
      if (!action.payload) {
        // TODO: At the moment this resets the filters when the search is cleared,
        // needs to be updated when user filters are implemented
        state.backlog.filteredTaskIds = state.backlog.taskIds;
        state.backlog.filteredTaskIdsByColumn =
          recalculateFilteredTaskIdsByColumn({
            state,
            status: TaskStatus.backlog,
          });
        state.board.filteredTaskIds = state.board.taskIds;
        state.board.filteredTaskIdsByColumn =
          recalculateFilteredTaskIdsByColumn({
            state,
            status: TaskStatus.board,
          });
      } else {
        const searchQuery = action.payload.toLowerCase();

        state.backlog.filteredTaskIds = state.backlog.taskIds.filter(
          (taskId) => {
            const task = state.backlog.tasksData[taskId];
            return (
              task.summary.toLowerCase().includes(searchQuery) ||
              task.id.toLowerCase().includes(searchQuery)
            );
          },
        );

        state.backlog.filteredTaskIdsByColumn =
          recalculateFilteredTaskIdsByColumn({
            state,
            status: TaskStatus.backlog,
          });

        state.board.filteredTaskIds = state.board.taskIds.filter((taskId) => {
          const task = state.board.tasksData[taskId];
          return (
            task.summary.toLowerCase().includes(searchQuery) ||
            task.id.toLowerCase().includes(searchQuery)
          );
        });

        state.board.filteredTaskIdsByColumn =
          recalculateFilteredTaskIdsByColumn({
            state,
            status: TaskStatus.board,
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

      // Remove the taskId from old status ids and filteredIds
      const updatedOldIds = state[oldStatus].taskIds.filter(
        (id) => id !== taskId,
      );
      const updatedOldFilteredIds = state[oldStatus].filteredTaskIds.filter(
        (id) => id !== taskId,
      );

      state[oldStatus].taskIds = updatedOldIds;
      state[oldStatus].filteredTaskIds = updatedOldFilteredIds;

      // Remove the task data from old status data
      const { [taskId]: removedItem, ...remainingOldData } =
        state[oldStatus].tasksData;

      state[oldStatus].tasksData = remainingOldData;

      // Recalculate filtered task ids by column
      state[oldStatus].filteredTaskIdsByColumn =
        recalculateFilteredTaskIdsByColumn({
          state,
          status: oldStatus,
        });

      // Add the taskId to new status ids and filteredIds at the correct newIndex
      const updatedNewIds = [...state[newStatus].taskIds];
      updatedNewIds.splice(newIndex, 0, taskId);

      const updatedFilteredNewIds = [
        ...state[newStatus].filteredTaskIds,
        taskId,
      ];

      state[newStatus].taskIds = updatedNewIds;

      state[newStatus].filteredTaskIds = updatedFilteredNewIds.sort((a, b) => {
        return (
          state[newStatus].taskIds.indexOf(a) -
          state[newStatus].taskIds.indexOf(b)
        );
      });

      // Add the task data to the new status data, updating its status
      state[newStatus].tasksData = {
        ...state[newStatus].tasksData,
        [taskId]: { ...removedItem, status: newStatus },
      };

      state[newStatus].filteredTaskIdsByColumn =
        recalculateFilteredTaskIdsByColumn({
          state,
          status: newStatus,
        });
    },
    updateTaskPositionLocally: (
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

        state[taskStatus].filteredTaskIds = state[
          taskStatus
        ].filteredTaskIds.sort((a, b) => {
          return (
            state[taskStatus].taskIds.indexOf(a) -
            state[taskStatus].taskIds.indexOf(b)
          );
        });

        state[taskStatus].filteredTaskIdsByColumn =
          recalculateFilteredTaskIdsByColumn({
            state,
            status: taskStatus,
          });
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
  updateTaskPositionLocally,
  filterAllTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
