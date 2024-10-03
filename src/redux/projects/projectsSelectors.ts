import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectProjects = (state: RootState) => state.projects.projects;
export const selectSelectedProjectData = (state: RootState) =>
  state.projects.selectedProjectData;
export const selectSelectedProjectId = (state: RootState) =>
  state.projects.selectedProjectId;

export const selectSelectedProject = createSelector(
  [selectProjects, selectSelectedProjectId],
  (projects, selectedProjectId) => {
    return projects.find((project) => project.id === selectedProjectId) || null;
  },
);
