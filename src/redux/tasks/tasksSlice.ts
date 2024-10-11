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
} from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import {
  BacklogTasksData,
  BoardTasksData,
  ITasksState,
  TaskStatus,
  TaskStatusDataFields,
} from './tasksTypes';
import { groupFirestoreDocsById } from '../../utils/dataUtils';
import { TASK_STATUS_FIELDS } from '../../constants/tasks';
import actions from '../../constants/actions';
import { RootState } from '../store';

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
      newIndex,
    }: {
      taskId: string;
      newStatus: TaskStatus;
      oldStatus: TaskStatus;
      newIndex: number;
    },
    { rejectWithValue, dispatch, getState },
  ) => {
    try {
      const state = getState() as RootState;
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

      dispatch(
        updateTaskStatusAndPositionLocally({
          taskId,
          newStatus,
          oldStatus,
          newIndex,
        }),
      );

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

      const { data } = groupFirestoreDocsById(querySnapshot.docs);

      const taskOrderRef = doc(db, `projects/${projectId}/taskOrders/backlog`);
      const taskOrderSnapshot = await getDoc(taskOrderRef);

      let taskOrder = [];
      if (taskOrderSnapshot.exists()) {
        taskOrder = taskOrderSnapshot.data().taskOrder || [];
      }

      return { ids: taskOrder, data };
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

      const { data } = groupFirestoreDocsById(querySnapshot.docs);

      const taskOrderRef = doc(db, `projects/${projectId}/taskOrders/board`);
      const taskOrderSnapshot = await getDoc(taskOrderRef);

      let taskOrder = [];
      if (taskOrderSnapshot.exists()) {
        taskOrder = taskOrderSnapshot.data().taskOrder || [];
      }

      return { ids: taskOrder, data };
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
      dataField,
    }: { taskId: string; newColumnId: string; dataField: TaskStatusDataFields },
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState() as RootState;
      const projectId = state.projects.selectedProjectId;
      const taskRef = doc(db, `projects/${projectId}/tasks/${taskId}`);

      await updateDoc(taskRef, {
        columnId: newColumnId,
      });

      return { taskId, newColumnId, dataField };
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
      dataField,
    }: {
      taskId: string;
      newAssigneeId: string | null;
      dataField: TaskStatusDataFields;
    },
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState() as RootState;
      const projectId = state.projects.selectedProjectId;
      const taskRef = doc(db, `projects/${projectId}/tasks/${taskId}`);

      await updateDoc(taskRef, { assignedTo: newAssigneeId });

      return { taskId, newAssigneeId, dataField };
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
      newIndex,
      taskStatus,
    }: {
      taskId: string;
      newIndex: number;
      taskStatus: TaskStatus;
    },
    { rejectWithValue, getState, dispatch },
  ) => {
    try {
      dispatch(
        updateTaskPositionLocally({
          taskId,
          newIndex,
          taskStatus,
        }),
      );

      const state = getState() as RootState;
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
  tasks: [],
  backlogTaskIds: [],
  backlogTasksData: {},
  boardTaskIds: [],
  boardTasksData: {},
  search: '',
};

const tasksSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<{ search: string }>) => {
      state.search = action.payload.search;
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

      const oldTaskStatusFields = TASK_STATUS_FIELDS[oldStatus];
      const newTaskStatusFields = TASK_STATUS_FIELDS[newStatus];

      // Remove the taskId from the old status ids
      const updatedOldIds = state[oldTaskStatusFields.ids].filter(
        (id) => id !== taskId,
      );

      state[oldTaskStatusFields.ids] = updatedOldIds;

      // Remove the task data from old status data
      const { [taskId]: removedItem, ...remainingOldData } =
        state[oldTaskStatusFields.data];
      state[oldTaskStatusFields.data] = remainingOldData;

      // Add the taskId to the new status ids at the correct newIndex
      const updatedNewIds = [...state[newTaskStatusFields.ids]];
      updatedNewIds.splice(newIndex, 0, taskId);

      state[newTaskStatusFields.ids] = updatedNewIds;

      // Add the task data to the new status data, updating its status
      state[newTaskStatusFields.data] = {
        ...state[newTaskStatusFields.data],
        [taskId]: { ...removedItem, status: newStatus },
      };
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

      const idsField = TASK_STATUS_FIELDS[taskStatus].ids;

      const currentIndex = state[idsField].indexOf(taskId);

      if (currentIndex !== -1) {
        state[idsField].splice(currentIndex, 1);

        state[idsField].splice(newIndex, 0, taskId);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBacklogTasks.fulfilled, (state, action) => {
      state.backlogTaskIds = action.payload.ids;
      state.backlogTasksData = action.payload.data as BacklogTasksData;
    });
    builder.addCase(fetchBoardTasks.fulfilled, (state, action) => {
      state.boardTaskIds = action.payload.ids;
      state.boardTasksData = action.payload.data as BoardTasksData;
    });
    builder.addCase(moveTaskToColumn.fulfilled, (state, action) => {
      state[action.payload.dataField][action.payload.taskId] = {
        ...state[action.payload.dataField][action.payload.taskId],
        columnId: action.payload.newColumnId,
      };
    });
    builder.addCase(setTaskAssignee.fulfilled, (state, action) => {
      state[action.payload.dataField][action.payload.taskId] = {
        ...state[action.payload.dataField][action.payload.taskId],
        assignedTo: action.payload.newAssigneeId,
      };
    });
  },
});

export const {
  updateTaskStatusAndPositionLocally,
  setSearchTerm,
  updateTaskPositionLocally,
} = tasksSlice.actions;

export default tasksSlice.reducer;
