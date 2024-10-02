import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { ColumnsData, IColumnsState } from './columnsTypes';
import { groupFirestoreDocsById } from '../../utils/dataUtils';
import actions from '../../constants/actions';

export const fetchProjectColumns = createAsyncThunk(
  actions.fetchProjectColumns,
  async (projectId: string, { rejectWithValue }) => {
    try {
      const columnsRef = collection(db, `projects/${projectId}/columns`);
      const columnsQuery = query(columnsRef, orderBy('order'));

      const columnsSnapshot = await getDocs(columnsQuery);

      const { ids, data } = groupFirestoreDocsById(columnsSnapshot.docs);

      return { ids, data };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const initialState: IColumnsState = {
  columnIds: [],
  columnsData: {},
};

const columnsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProjectColumns.fulfilled, (state, action) => {
      state.columnIds = action.payload.ids;
      state.columnsData = action.payload.data as ColumnsData;
    });
  },
});

export default columnsSlice.reducer;
