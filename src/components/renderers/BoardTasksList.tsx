import { useAppSelector } from '../../hooks/useAppSelector';
import { selectBoardTaskIds } from '../../redux/tasks/tasksSelectors';
import TaskList from '../ui/TaskList/TaskList';
import BoardTaskItem from './BoardTaskItem';

const BoardTasksList = () => {
  const boardTaskIds = useAppSelector(selectBoardTaskIds);

  return (
    <TaskList taskIds={boardTaskIds} title="Board" renderItem={BoardTaskItem} />
  );
};

export default BoardTasksList;
