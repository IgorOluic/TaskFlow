export default {
  // auth
  registerUser: 'auth/registerUser',
  loginUser: 'auth/loginUser',
  logoutUser: 'auth/logoutUser',

  // projects
  fetchProjects: 'projects/fetchProjects',
  fetchProjectByKey: 'projects/fetchProjectByKey',
  createNewProject: 'projects/createNewProject',
  inviteToProject: 'projects/inviteToProject',

  // columns
  fetchProjectColumns: 'columns/fetchProjectColumns',

  // tasks
  createTask: 'tasks/createTask',
  updateTaskStatusAndPosition: 'tasks/updateTaskStatusAndPosition',
  fetchBacklogTasks: 'tasks/fetchBacklogTasks',
  fetchTasks: 'tasks/fetchTasks',
  fetchBoardTasks: 'tasks/fetchBoardTasks',
  moveTaskToColumn: 'tasks/moveTaskToColumn',
  setTaskAssignee: 'tasks/setTaskAssignee',
  updateTaskPosition: 'tasks/updateTaskPosition',
  reorderTaskPositionInColumn: 'tasks/reorderTaskPositionInColumn',
  updateTaskColumnAndPosition: 'tasks/updateTaskColumnAndPosition',

  // invitations
  fetchInvitations: 'invitations/fetchInvitations',
  acceptInvitation: 'invitations/acceptInvitation',
  denyInvitation: 'invitations/denyInvitation',

  // members
  fetchProjectMembers: 'members/fetchProjectMembers',
  trackProjectMembers: 'members/trackProjectMembers',
};
