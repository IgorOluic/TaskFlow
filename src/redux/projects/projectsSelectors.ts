import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectProjects = (state: RootState) => state.projects.projects;
const selectSelectedProjectId = (state: RootState) =>
  state.projects.selectedProjectId;

export const selectSelectedProject = createSelector(
  [selectProjects, selectSelectedProjectId],
  (projects, selectedProjectId) => {
    return projects.find((project) => project.id === selectedProjectId) || null;
  },
);
