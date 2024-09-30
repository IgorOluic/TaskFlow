import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { IColumn, IColumnsState } from './columnsTypes';

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

const initialState: IColumnsState = {
  columns: [],
};

const columnsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProjectColumns.fulfilled, (state, action) => {
      state.columns = action.payload;
    });
  },
});

export default columnsSlice.reducer;
