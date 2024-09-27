import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getDocs,
  collection,
  doc,
  writeBatch,
  query,
  orderBy,
  addDoc,
  updateDoc,
  arrayUnion,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { IColumn, IProject, IProjectsState } from './projectsTypes';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projects = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        const createdAt = data.createdAt?.toDate
          ? data.createdAt.toDate()
          : null;

        return {
          id: doc.id,
          ...data,
          createdAt: createdAt ? createdAt.toISOString() : null, // Convert to serializable ISO string
        } as IProject;
      });

      return projects;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchProjectColumns = createAsyncThunk(
  'projects/fetchColumns',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const columnsRef = collection(db, `projects/${projectId}/columns`);
      const columnsQuery = query(columnsRef, orderBy('order'));

      const columnsSnapshot = await getDocs(columnsQuery);

      const columns = columnsSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as IColumn,
      );

      return columns;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createNewProject = createAsyncThunk(
  'projects/addProjectToFirestore',
  async (
    { name, description }: { name: string; description: string },
    { rejectWithValue },
  ) => {
    try {
      const batch = writeBatch(db);

      const projectRef = doc(collection(db, 'projects'));

      batch.set(projectRef, {
        name,
        description,
        createdAt: new Date(),
      });

      const columns = [
        { name: 'To Do', order: 1, tasks: [] },
        { name: 'In Progress', order: 2, tasks: [] },
        { name: 'Testing', order: 3, tasks: [] },
        { name: 'Done', order: 4, tasks: [] },
      ];

      columns.forEach((column) => {
        const columnRef = doc(
          collection(db, `projects/${projectRef.id}/columns`),
        );
        batch.set(columnRef, column);
      });

      await batch.commit();

      return { name, description, id: projectRef.id };
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

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

const initialState: IProjectsState = {
  selectedProjectId: null,
  projects: [],
  columns: [],
  loading: false,
  error: null,
  backlogTasks: [],
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSelectedProjectId: (state, action: PayloadAction<string>) => {
      state.selectedProjectId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })
      .addCase(fetchProjectColumns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectColumns.fulfilled, (state, action) => {
        state.loading = false;
        state.columns = action.payload;
      })
      .addCase(fetchProjectColumns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBacklogTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBacklogTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.backlogTasks = action.payload;
      })
      .addCase(fetchBacklogTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedProjectId } = projectsSlice.actions;

export default projectsSlice.reducer;
