import { HStack } from '@chakra-ui/react';
import TaskBoardColumn from './TaskBoardColumn';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectColumnIds } from '../../../redux/columns/columnsSelectors';

const TaskBoard = () => {
  const columnIds = useAppSelector(selectColumnIds);

  const renderColumnItem = (columnId: string, index: number): JSX.Element => {
    return <TaskBoardColumn key={index} id={columnId} />;
  };

  return (
    <HStack w="full" h="500px" overflowX="scroll" className="no-select">
      {columnIds.map(renderColumnItem)}
    </HStack>
  );
};

export default TaskBoard;
