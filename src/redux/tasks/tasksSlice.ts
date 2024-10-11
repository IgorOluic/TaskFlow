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

export const changeTaskStatus = createAsyncThunk(
  actions.changeTaskStatus,
  async (
    {
      projectId,
      taskId,
      newStatus,
      oldStatus,
    }: {
      projectId: string;
      taskId: string;
      newStatus: TaskStatus;
      oldStatus: TaskStatus;
    },
    { rejectWithValue, dispatch },
  ) => {
    try {
      dispatch(setNewTaskStatus({ taskId, newStatus, oldStatus }));

      const taskRef = doc(db, `projects/${projectId}/tasks/${taskId}`);

      await updateDoc(taskRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      return { taskId, newStatus };
    } catch (error) {
      console.error('Error updating task status:', error);
      return rejectWithValue('Failed to update task status');
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
      const taskOrdersId =
        taskStatus === TaskStatus.backlog ? 'backlog' : 'board';

      dispatch(
        updateTaskOrderLocally({
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
        `projects/${projectId}/taskOrders/${taskOrdersId}`,
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
    setNewTaskStatus: (
      state,
      action: PayloadAction<{
        taskId: string;
        newStatus: TaskStatus;
        oldStatus: TaskStatus;
      }>,
    ) => {
      const { taskId, newStatus, oldStatus } = action.payload;

      const oldTaskStatusFields = TASK_STATUS_FIELDS[oldStatus];
      const newTaskStatusFields = TASK_STATUS_FIELDS[newStatus];

      // Remove the taskId from old status ids
      state[oldTaskStatusFields.ids] = state[oldTaskStatusFields.ids].filter(
        (id) => id !== taskId,
      );

      // Remove the task data from old status data
      const { [action.payload.taskId]: removedItem, ...newData } =
        state[oldTaskStatusFields.data];
      state[oldTaskStatusFields.data] = newData;

      // Add the taskId to new status ids
      state[newTaskStatusFields.ids] = [
        ...state[newTaskStatusFields.ids],
        taskId,
      ];

      // Add the task data to new status data
      state[newTaskStatusFields.data] = {
        ...state[newTaskStatusFields.data],
        [taskId]: { ...removedItem, status: newStatus },
      };
    },
    updateTaskOrderLocally: (
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

export const { setNewTaskStatus, setSearchTerm, updateTaskOrderLocally } =
  tasksSlice.actions;

export default tasksSlice.reducer;
