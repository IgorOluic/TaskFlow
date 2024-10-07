import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  getDoc,
  runTransaction,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import actions from '../../constants/actions';
import { IProjectInvitation } from './invitationsTypes';
import { getAuth } from 'firebase/auth';
import { IInvitationsState } from './invitationsTypes';
import { ProjectRoles } from '../projects/projectsTypes';

export const fetchInvitations = createAsyncThunk(
  actions.fetchInvitations,
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('User is not authenticated');
      }

      const invitationsRef = collection(db, 'invitations');
      const invitationsQuery = query(
        invitationsRef,
        where('invitee', '==', currentUser.email),
      );

      const querySnapshot = await getDocs(invitationsQuery);

      const invitations = await Promise.all(
        querySnapshot.docs.map(async (docSnapshot) => {
          const invitationData = docSnapshot.data();

          const projectRef = doc(db, 'projects', invitationData.projectId);
          const projectSnapshot = await getDoc(projectRef);
          const projectData = projectSnapshot.exists()
            ? projectSnapshot.data()
            : null;

          if (projectData && projectData.createdAt?.toDate) {
            projectData.createdAt = projectData.createdAt
              .toDate()
              .toISOString();
          }

          const inviterRef = doc(db, 'users', invitationData.inviterId);
          const inviterSnapshot = await getDoc(inviterRef);
          const inviterData = inviterSnapshot.exists()
            ? inviterSnapshot.data()
            : null;

          if (inviterData && inviterData.createdAt?.toDate) {
            inviterData.createdAt = inviterData.createdAt
              .toDate()
              .toISOString();
          }

          return {
            id: docSnapshot.id,
            ...invitationData,
            project: projectData || {},
            inviter: inviterData || {},
          };
        }),
      );

      return invitations as IProjectInvitation[];
    } catch (error) {
      console.error('Error fetching invitations:', error);
      return rejectWithValue('Failed to fetch invitations');
    }
  },
);

export const acceptInvitation = createAsyncThunk(
  actions.acceptInvitation,
  async (
    { invitationId, projectId }: { invitationId: string; projectId: string },
    { rejectWithValue },
  ) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('User is not authenticated');
      }

      const projectRef = doc(db, `projects/${projectId}`);
      const invitationRef = doc(db, 'invitations', invitationId);
      const memberRef = doc(
        db,
        `projects/${projectId}/members`,
        currentUser.uid,
      );

      await runTransaction(db, async (transaction) => {
        const projectSnapshot = await transaction.get(projectRef);

        if (!projectSnapshot.exists()) {
          throw new Error('Project does not exist');
        }

        const memberSnapshot = await transaction.get(memberRef);
        if (memberSnapshot.exists()) {
          throw new Error('User is already a member of the project');
        }

        transaction.set(memberRef, {
          userId: currentUser.uid,
          role: ProjectRoles.member,
          addedAt: new Date(),
        });

        transaction.delete(invitationRef);
      });

      return invitationId;
    } catch (error) {
      console.error('Error accepting invitation:', error);
      return rejectWithValue('Failed to accept invitation');
    }
  },
);

export const denyInvitation = createAsyncThunk(
  actions.denyInvitation,
  async ({ invitationId }: { invitationId: string }, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('User is not authenticated');
      }

      const invitationRef = doc(db, 'invitations', invitationId);

      await deleteDoc(invitationRef);

      return invitationId;
    } catch (error) {
      console.error('Error denying invitation:', error);
      return rejectWithValue('Failed to deny invitation');
    }
  },
);

const initialState: IInvitationsState = {
  invitations: [],
};

const invitationsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchInvitations.fulfilled, (state, action) => {
      state.invitations = action.payload;
    });
    builder.addCase(acceptInvitation.fulfilled, (state, action) => {
      state.invitations = state.invitations.filter(
        (invitation) => invitation.id !== action.payload,
      );
    });
    builder.addCase(denyInvitation.fulfilled, (state, action) => {
      state.invitations = state.invitations.filter(
        (invitation) => invitation.id !== action.payload,
      );
    });
  },
});

export default invitationsSlice.reducer;
