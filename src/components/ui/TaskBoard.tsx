import { HStack } from '@chakra-ui/react';
import TaskBoardColumn from './TaskBoardColumn';
import { useAppSelector } from '../../hooks/useAppSelector';
import { IColumn } from '../../redux/projects/projectsTypes';

const TaskBoard = () => {
  const { columns } = useAppSelector((state) => state.projects);

  const renderColumnItem = (column: IColumn, index: number): JSX.Element => {
    return <TaskBoardColumn key={index} column={column} />;
  };

  return (
    <HStack w="full" h="500px" backgroundColor="blue.100" overflowX="scroll">
      {columns.map(renderColumnItem)}
    </HStack>
  );
};

export default TaskBoard;
