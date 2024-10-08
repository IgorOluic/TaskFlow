import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  runTransaction,
  updateDoc,
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
      let taskId;

      await runTransaction(db, async (transaction) => {
        const projectDoc = await transaction.get(projectRef);

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

      const { ids, data } = groupFirestoreDocsById(querySnapshot.docs);

      return { ids, data };
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

      const q = query(tasksRef, where('status', '==', TaskStatus.active));

      const querySnapshot = await getDocs(q);

      const { ids, data } = groupFirestoreDocsById(querySnapshot.docs);

      return { ids, data };
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

      console.log('done');

      return { taskId, newColumnId, dataField };
    } catch (error) {
      console.error('Error moving task to new column:', error);
      return rejectWithValue('Failed to move task to new column');
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
  },
});

export const { setNewTaskStatus, setSearchTerm } = tasksSlice.actions;

export default tasksSlice.reducer;
