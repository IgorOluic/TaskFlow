export default {
  // auth
  registerUser: 'auth/registerUser',
  loginUser: 'auth/loginUser',
  logoutUser: 'auth/logoutUser',

  // projects
  fetchProjects: 'projects/fetchProjects',
  fetchProjectByKey: 'projects/fetchProjectByKey',
  createNewProject: 'projects/createNewProject',

  // columns
  fetchProjectColumns: 'columns/fetchProjectColumns',

  // tasks
  createTask: 'tasks/createTask',
  changeTaskStatus: 'tasks/changeTaskStatus',
  fetchBacklogTasks: 'tasks/fetchBacklogTasks',
  fetchBoardTasks: 'tasks/fetchBoardTasks',
};
