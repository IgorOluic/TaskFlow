import { useAppSelector } from '../../hooks/useAppSelector';
import { selectBacklogTaskIds } from '../../redux/tasks/tasksSelectors';
import TaskList from '../ui/TaskList/TaskList';

const BacklogTasksList = () => {
  const backlogTaskIds = useAppSelector(selectBacklogTaskIds);

  return <TaskList taskIds={backlogTaskIds} title="Backlog" />;
};

export default BacklogTasksList;
