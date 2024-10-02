import { useAppSelector } from '../../hooks/useAppSelector';
import { selectBacklogTaskById } from '../../redux/tasks/tasksSelectors';
import TaskListItem from '../ui/TaskList/TaskListItem';

interface BacklogTaskItemProps {
  id: string;
  isLastItem: boolean;
}

const BacklogTaskItem = ({ id, isLastItem }: BacklogTaskItemProps) => {
  const taskData = useAppSelector(selectBacklogTaskById(id));

  return <TaskListItem task={taskData} isLastItem={isLastItem} />;
};

export default BacklogTaskItem;
