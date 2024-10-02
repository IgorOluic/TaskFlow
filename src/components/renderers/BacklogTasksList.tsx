import { useAppSelector } from '../../hooks/useAppSelector';
import { selectBacklogTaskIds } from '../../redux/tasks/tasksSelectors';
import TaskList from '../ui/TaskList/TaskList';
import BacklogTaskItem from './BacklogTaskItem';

const BacklogTasksList = () => {
  const backlogTaskIds = useAppSelector(selectBacklogTaskIds);

  return (
    <TaskList
      taskIds={backlogTaskIds}
      title="Backlog"
      renderItem={BacklogTaskItem}
    />
  );
};

export default BacklogTasksList;
