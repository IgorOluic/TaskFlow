import { useAppSelector } from '../../hooks/useAppSelector';
import { selectBoardTaskById } from '../../redux/tasks/tasksSelectors';
import TaskListItem from '../ui/TaskList/TaskListItem';

interface BoardTaskItemProps {
  id: string;
  isLastItem: boolean;
}

const BoardTaskItem = ({ id, isLastItem }: BoardTaskItemProps) => {
  const taskData = useAppSelector(selectBoardTaskById(id));

  return <TaskListItem task={taskData} isLastItem={isLastItem} isBoard />;
};

export default BoardTaskItem;
