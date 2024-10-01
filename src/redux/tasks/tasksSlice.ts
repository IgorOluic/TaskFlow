import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  runTransaction,
} from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { BacklogTasksData, ITasksState, TaskStatus } from './tasksTypes';
import { groupFirestoreDocsById } from '../../utils/data';

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (
    {
      projectId,
      projectKey,
      columnId,
      summary,
      description,
    }: {
      projectId: string;
      projectKey: string;
      columnId?: string | null;
      summary: string;
      description: string;
    },
    { rejectWithValue },
  ) => {
    try {
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
          assignedTo: null,
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

export const fetchBacklogTasks = createAsyncThunk(
  'tasks/fetchBacklogTasks',
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

const initialState: ITasksState = {
  tasks: [],
  backlogTaskIds: [],
  backlogTasksData: {},
};

const tasksSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBacklogTasks.fulfilled, (state, action) => {
      state.backlogTaskIds = action.payload.ids;
      state.backlogTasksData = action.payload.data as BacklogTasksData;
    });
  },
});

export default tasksSlice.reducer;
