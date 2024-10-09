import { VStack } from '@chakra-ui/react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectBoardTasksByColumnId } from '../../../redux/tasks/tasksSelectors';
import TaskBoardItem from './TaskBoardItem';

interface ColumnTaskListProps {
  columnId: string;
}

const ColumnTaskList = ({ columnId }: ColumnTaskListProps) => {
  const columnTaskIds = useAppSelector(selectBoardTasksByColumnId(columnId));

  const renderTaskItem = (taskId: string, index: number): JSX.Element => {
    return <TaskBoardItem key={index} taskId={taskId} />;
  };

  return <VStack w="full">{columnTaskIds.map(renderTaskItem)}</VStack>;
};

export default ColumnTaskList;
