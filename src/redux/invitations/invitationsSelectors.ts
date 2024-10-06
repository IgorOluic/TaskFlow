import { createSelector } from 'reselect';
import { RootState } from '../store';

const selectInvitationsSlice = (state: RootState) => state.invitations;

export const selectInvitations = createSelector(
  [selectInvitationsSlice],
  (invitationsSlice) => invitationsSlice.invitations,
);
