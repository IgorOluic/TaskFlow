import { createSelector } from 'reselect';
import { RootState } from '../store';

const selectMembersSlice = (state: RootState) => state.members;

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

export const selectMemberById = (id: string | null) =>
  createSelector([selectMembersData], (membersData) => {
    if (!id || !membersData) {
      return null;
    }
    return membersData[id] || null;
  });
