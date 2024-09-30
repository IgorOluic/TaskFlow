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
  getDoc,
  runTransaction,
} from 'firebase/firestore';
import { db, storage } from '../../firebase/firebaseConfig';
import {
  IColumn,
  IProjectWithOwnerDetails,
  IProjectsState,
} from './projectsTypes';
import { getAuth } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('User is not authenticated');
      }

      const projectQuery = query(
        collection(db, 'projects'),
        where('users', 'array-contains', currentUser.uid),
      );

      const querySnapshot = await getDocs(projectQuery);

      const projects = await Promise.all(
        querySnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();

          const createdAt = data.createdAt?.toDate
            ? data.createdAt.toDate().toISOString()
            : null;

          let ownerDetails = null;
          if (data.owner) {
            const ownerDoc = await getDoc(doc(db, 'users', data.owner));
            if (ownerDoc.exists()) {
              ownerDetails = ownerDoc.data();

              if (ownerDetails?.createdAt?.toDate) {
                ownerDetails.createdAt = ownerDetails.createdAt
                  .toDate()
                  .toISOString();
              }
            }
          }

          return {
            id: docSnapshot.id,
            ...data,
            createdAt,
            ownerDetails,
          } as IProjectWithOwnerDetails;
        }),
      );

      return projects;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchProjectByKey = createAsyncThunk(
  'projects/fetchProjectByKey',
  async (key: string, { rejectWithValue }) => {
    try {
      const projectKeyQuery = query(
        collection(db, 'projectKeys'),
        where('__name__', '==', key),
      );
      const keySnapshot = await getDocs(projectKeyQuery);

      if (keySnapshot.empty) {
        throw new Error('Project not found');
      }

      const projectKeyDoc = keySnapshot.docs[0];
      const { projectId } = projectKeyDoc.data();

      const projectRef = doc(db, 'projects', projectId);
      const projectSnapshot = await getDoc(projectRef);

      if (!projectSnapshot.exists()) {
        throw new Error('Project not found');
      }

      const data = projectSnapshot.data();

      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : null;

      let ownerDetails = null;
      if (data.owner) {
        const ownerDoc = await getDoc(doc(db, 'users', data.owner));
        ownerDetails = ownerDoc.exists() ? ownerDoc.data() : null;
      }

      return {
        id: projectSnapshot.id,
        ...data,
        createdAt: createdAt ? createdAt.toISOString() : null,
        ownerDetails,
      } as IProjectWithOwnerDetails;
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
    {
      name,
      projectKey,
      defaultIconId,
      image,
    }: {
      name: string;
      projectKey: string;
      defaultIconId: number | null;
      image: File | null;
    },
    { rejectWithValue },
  ) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('User is not authenticated');
      }

      const projectKeyRef = doc(db, 'projectKeys', projectKey);

      return await runTransaction(db, async (transaction) => {
        const projectKeySnapshot = await transaction.get(projectKeyRef);

        if (projectKeySnapshot.exists()) {
          throw new Error(
            'Project key already exists. Please choose a different key.',
          );
        }

        const projectRef = doc(collection(db, 'projects'));
        let projectIconUrl = null;

        if (image) {
          const imageRef = ref(storage, `project-icons/${projectRef.id}`);
          await uploadBytes(imageRef, image);
          projectIconUrl = await getDownloadURL(imageRef);
        }

        transaction.set(projectRef, {
          name,
          key: projectKey,
          createdAt: new Date(),
          owner: currentUser.uid,
          users: [currentUser.uid],
          iconUrl: projectIconUrl, // Use the image URL if uploaded, otherwise use default icon
          defaultIconId: image ? null : defaultIconId,
        });

        transaction.set(projectKeyRef, {
          projectId: projectRef.id,
        });

        const batch = writeBatch(db);
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

        return {
          name,
          id: projectRef.id,
          key: projectKey,
          iconUrl: projectIconUrl,
        };
      });
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
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
      .addCase(fetchProjectByKey.fulfilled, (state, action) => {
        state.selectedProjectId = action.payload.id;
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
