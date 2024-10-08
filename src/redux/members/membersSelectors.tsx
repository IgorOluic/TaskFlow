import { createSelector } from 'reselect';
import { RootState } from '../store';

const selectMembersSlice = (state: RootState) => state.members;

// Select project members data
export const selectMembersData = createSelector(
  [selectMembersSlice],
  (membersSlice) => membersSlice.projectMembers,
);

// Select filtered member IDs based on the search query
export const selectFilteredMemberIds = createSelector(
  [selectMembersSlice, selectMembersData],
  (membersSlice, membersData) => {
    const searchQuery = membersSlice.assigneeSearch.toLowerCase();

    return membersSlice.projectMemberIds.filter((memberId) => {
      const member = membersData[memberId];
      return (
        member.firstName.toLowerCase().includes(searchQuery) ||
        member.lastName.toLowerCase().includes(searchQuery) ||
        `${member.firstName.toLowerCase()} ${member.lastName.toLowerCase()}`.includes(
          searchQuery,
        ) || // Full name search
        (member.email?.toLowerCase().includes(searchQuery) ?? false) // Optional email search
      );
    });
  },
);

export const selectMemberById = (id: string) =>
  createSelector([selectMembersData], (membersData) => membersData[id]);
