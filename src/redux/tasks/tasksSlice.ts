import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  collection,
  doc,
  updateDoc,
  arrayUnion,
  addDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { ITasksState } from './tasksTypes';

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (
    {
      projectId,
      columnId,
      taskData,
    }: {
      projectId: string;
      columnId?: string | null;
      taskData: { title: string; description: string };
    },
    { rejectWithValue },
  ) => {
    try {
      const tasksRef = collection(db, `projects/${projectId}/tasks`);

      const newTask = {
        ...taskData,
        columnId: columnId || null,
        createdAt: new Date().toISOString(),
        status: columnId ? 'in-progress' : 'backlog',
        assignedTo: null,
      };

      const taskDocRef = await addDoc(tasksRef, newTask);
      const taskId = taskDocRef.id;

      if (columnId) {
        const columnRef = doc(db, `projects/${projectId}/columns/${columnId}`);
        await updateDoc(columnRef, {
          tasks: arrayUnion(taskId),
        });
      }

      return { id: taskId, ...newTask };
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

      const q = query(tasksRef, where('status', '==', 'backlog'));

      const querySnapshot = await getDocs(q);

      const tasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return tasks;
    } catch (error) {
      console.error('Error fetching backlog tasks:', error);
      return rejectWithValue('Failed to fetch backlog tasks');
    }
  },
);

const initialState: ITasksState = {
  tasks: [],
  backlogTasks: [],
};

const tasksSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBacklogTasks.fulfilled, (state, action) => {
      state.backlogTasks = action.payload;
    });
  },
});

export default tasksSlice.reducer;
