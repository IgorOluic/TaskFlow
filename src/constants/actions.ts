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
  changeTaskStatus: 'tasks/changeTaskStatus',
  fetchBacklogTasks: 'tasks/fetchBacklogTasks',
  fetchBoardTasks: 'tasks/fetchBoardTasks',
  moveTaskToColumn: 'tasks/moveTaskToColumn',

  // invitations
  fetchInvitations: 'invitations/fetchInvitations',
  acceptInvitation: 'invitations/acceptInvitation',
  denyInvitation: 'invitations/denyInvitation',

  // members
  fetchProjectMembers: 'members/fetchProjectMembers',
};
