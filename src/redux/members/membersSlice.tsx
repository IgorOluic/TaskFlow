import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getDocs, collection, getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import actions from '../../constants/actions';
import { IMember, IMembersState } from './membersTypes';
import { timestampToISOString } from '../../utils/dataUtils';
import { IUserData } from '../auth/authTypes';

export const fetchProjectMembers = createAsyncThunk(
  actions.fetchProjectMembers,
  async (projectId: string, { rejectWithValue }) => {
    try {
      const membersRef = collection(db, `projects/${projectId}/members`);

      const querySnapshot = await getDocs(membersRef);

      const result = await querySnapshot.docs.reduce(
        async (accPromise, docSnapshot) => {
          const acc = await accPromise;

          const memberData = docSnapshot.data();
          const userId = memberData.userId;

          const userDoc = await getDoc(doc(db, `users`, userId));

          let userData = null;
          if (userDoc.exists()) {
            userData = userDoc.data();
          }

          const combinedData = {
            ...(memberData as IMember),
            ...(userData as IUserData),
            addedAt: timestampToISOString(memberData.addedAt),
            createdAt: timestampToISOString(userData?.createdAt),
          };

          acc.ids.push(userId);
          acc.data[userId] = combinedData;

          return acc;
        },
        Promise.resolve({
          ids: [] as string[],
          data: {} as Record<string, IMember & IUserData>,
        }),
      );

      return result;
    } catch (error) {
      console.error('Error fetching project members:', error);
      return rejectWithValue('Failed to fetch project members');
    }
  },
);

const initialState: IMembersState = {
  projectMembers: {},
  projectMemberIds: [],
  assigneeSearch: '',
};

const membersSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setAssigneeSearch: (state, action: PayloadAction<string>) => {
      state.assigneeSearch = action.payload;
    },
    updateProjectMembers: (
      state,
      action: PayloadAction<{ ids: string[]; data: Record<string, IMember> }>,
    ) => {
      state.projectMembers = action.payload.data;
      state.projectMemberIds = action.payload.ids;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProjectMembers.fulfilled, (state, action) => {
      state.projectMembers = action.payload.data;
      state.projectMemberIds = action.payload.ids;
    });
  },
});

export const { setAssigneeSearch, updateProjectMembers } = membersSlice.actions;
export default membersSlice.reducer;
