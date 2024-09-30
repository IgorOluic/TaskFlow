import { createSelector } from 'reselect';
import { RootState } from '../store';

const selectColumnsSlice = (state: RootState) => state.columns;

export const selectColumnIds = createSelector(
  [selectColumnsSlice],
  (columnsSlice) => columnsSlice.columnIds,
);

export const selectColumnsData = createSelector(
  [selectColumnsSlice],
  (columnsSlice) => columnsSlice.columnsData,
);

export const selectColumnById = (columnId: string) =>
  createSelector([selectColumnsData], (columnsData) => columnsData[columnId]);
