import { createSlice, isFulfilled } from '@reduxjs/toolkit';
import { IAppState } from './appTypes';
import {
  getBaseActionType,
  isPendingAction,
  isRejectedAction,
} from '../../utils/reduxUtils';

const initialState: IAppState = {
  loading: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // LOADING HANDLERS
    builder.addMatcher(isPendingAction, (state, action: { type: string }) => {
      state.loading = [...state.loading, getBaseActionType(action.type)];
    });

    builder.addMatcher(isFulfilled, (state, action: { type: string }) => {
      state.loading = state.loading.filter(
        (item) => item !== getBaseActionType(action.type),
      );
    });

    builder.addMatcher(isRejectedAction, (state, action: { type: string }) => {
      state.loading = state.loading.filter(
        (item) => item !== getBaseActionType(action.type),
      );
    });
  },
});

export default appSlice.reducer;
