import { createSelector } from 'reselect';
import { RootState } from '../store';

const selectLoading = (state: RootState) => state.app.loading;

export const makeSelectIsLoading = (actionTypes: string | string[]) =>
  createSelector([selectLoading], (loading) => {
    if (Array.isArray(actionTypes)) {
      return actionTypes.some((actionType) => loading.includes(actionType));
    }
    return loading.includes(actionTypes);
  });
