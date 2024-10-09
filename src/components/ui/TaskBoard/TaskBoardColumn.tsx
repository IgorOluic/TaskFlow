import { Box, Text, VStack } from '@chakra-ui/react';
import { selectColumnById } from '../../../redux/columns/columnsSelectors';
import { useAppSelector } from '../../../hooks/useAppSelector';
import ColumnTaskList from './ColumnTaskList';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { moveTaskToColumn } from '../../../redux/tasks/tasksSlice';
import { BOARD_TASKS_DATA } from '../../../constants/tasks';

interface TaskBoardColumnProps {
  id: string;
}

const TaskBoardColumn = ({ id }: TaskBoardColumnProps) => {
  const dispatch = useAppDispatch();
  const columnData = useAppSelector(selectColumnById(id));

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const taskId = event.dataTransfer.getData('taskId');

    dispatch(
      moveTaskToColumn({
        taskId,
        newColumnId: id,
        dataField: BOARD_TASKS_DATA,
      }),
    );
  };

  return (
    <VStack
      h="full"
      w="270px"
      backgroundColor="gray.100"
      borderRadius={8}
      position="relative"
      px={1.5}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Box top={0} py={3} w="full" h="56px" alignItems="center" px={2}>
        <Text fontSize={12} fontWeight={600} color="gray.600">
          {columnData.name}
        </Text>
      </Box>

      <ColumnTaskList columnId={id} />
    </VStack>
  );
};

export default TaskBoardColumn;
