import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getDocs,
  collection,
  doc,
  writeBatch,
  query,
  where,
  getDoc,
  runTransaction,
  setDoc,
  collectionGroup,
} from 'firebase/firestore';
import { db, storage } from '../../firebase/firebaseConfig';
import {
  IProjectWithOwnerDetails,
  IProjectsState,
  ProjectRoles,
} from './projectsTypes';
import { getAuth } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { fetchProjectColumns } from '../columns/columnsSlice';
import actions from '../../constants/actions';
import { RootState } from '../store';

export const fetchProjects = createAsyncThunk(
  actions.fetchProjects,
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('User is not authenticated');
      }

      // Query the 'members' subcollection across all projects where the current user is a member
      const memberProjectsQuery = query(
        collectionGroup(db, 'members'),
        where('userId', '==', currentUser.uid),
      );

      const memberQuerySnapshot = await getDocs(memberProjectsQuery);

      if (memberQuerySnapshot.empty) {
        return [];
      }

      const projects = await Promise.all(
        memberQuerySnapshot.docs.map(async (docSnapshot) => {
          const projectId = docSnapshot.ref.parent.parent?.id;

          if (!projectId) {
            throw new Error('Project ID not found.');
          }

          const projectRef = doc(db, 'projects', projectId);
          const projectSnapshot = await getDoc(projectRef);

          if (!projectSnapshot.exists()) {
            throw new Error(`Project ${projectId} does not exist`);
          }

          const projectData = projectSnapshot.data();
          const createdAt = projectData?.createdAt?.toDate
            ? projectData.createdAt.toDate().toISOString()
            : null;

          let ownerDetails = null;
          if (projectData?.ownerId) {
            const ownerDoc = await getDoc(
              doc(db, 'users', projectData.ownerId),
            );
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
            id: projectId,
            ...projectData,
            createdAt,
            ownerDetails,
          } as IProjectWithOwnerDetails;
        }),
      );

      return projects;
    } catch (error) {
      return rejectWithValue(error || 'Failed to fetch projects');
    }
  },
);

export const fetchProjectByKey = createAsyncThunk(
  actions.fetchProjectByKey,
  async (
    { key, fetchColumns }: { key: string; fetchColumns?: boolean },
    { rejectWithValue, dispatch },
  ) => {
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

      if (fetchColumns) {
        await dispatch(fetchProjectColumns(projectId));
      }

      if (!projectSnapshot.exists()) {
        throw new Error('Project not found');
      }

      const data = projectSnapshot.data();

      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : null;

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

export const createNewProject = createAsyncThunk(
  actions.createNewProject,
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
        // Ensure the project key is unique
        const projectKeySnapshot = await transaction.get(projectKeyRef);

        if (projectKeySnapshot.exists()) {
          throw new Error(
            'Project key already exists. Please choose a different key.',
          );
        }

        const projectRef = doc(collection(db, 'projects'));
        let projectIconUrl = null;

        // Upload project icon if provided
        if (image) {
          const imageRef = ref(storage, `project-icons/${projectRef.id}`);
          await uploadBytes(imageRef, image);
          projectIconUrl = await getDownloadURL(imageRef);
        }

        // Create the project document (without owner and users fields)
        transaction.set(projectRef, {
          name,
          key: projectKey,
          createdAt: new Date(),
          iconUrl: projectIconUrl, // Use the image URL if uploaded, otherwise use default icon
          defaultIconId: image ? null : defaultIconId,
          ownerId: currentUser.uid,
        });

        // Store the project key reference
        transaction.set(projectKeyRef, {
          projectId: projectRef.id,
        });

        // Create initial columns for the project
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

        console.log('fails here');

        const memberRef = doc(
          collection(db, `projects/${projectRef.id}/members`),
          currentUser.uid,
        );
        batch.set(memberRef, {
          userId: currentUser.uid,
          role: ProjectRoles.owner,
          addedAt: new Date(),
        });

        await batch.commit();

        // Return the project data
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

export const inviteToProject = createAsyncThunk(
  actions.inviteToProject,
  async (
    {
      email,
    }: {
      email: string;
    },
    { getState },
  ) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const state = getState() as RootState;
      const projectId = state.projects.selectedProjectId;

      if (!currentUser) {
        throw new Error('User is not authenticated');
      }

      if (!projectId) {
        throw new Error('No project selected');
      }

      const projectRef = doc(db, 'projects', projectId);
      const projectDoc = await getDoc(projectRef);

      if (!projectDoc.exists()) {
        throw new Error('Project does not exist');
      }

      const invitationId = `${projectId}_${email}`;
      const invitationRef = doc(db, 'invitations', invitationId);

      await setDoc(invitationRef, {
        projectId,
        inviterId: currentUser.uid,
        invitee: email,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error sending invitation:', error);
    }
  },
);

const initialState: IProjectsState = {
  selectedProjectId: null,
  selectedProjectData: null,
  projects: [],
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
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
      })
      .addCase(fetchProjectByKey.fulfilled, (state, action) => {
        state.selectedProjectId = action.payload.id;
        state.selectedProjectData = action.payload;
      });
  },
});

export const { setSelectedProjectId } = projectsSlice.actions;
export default projectsSlice.reducer;
