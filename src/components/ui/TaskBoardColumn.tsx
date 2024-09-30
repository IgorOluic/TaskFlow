import { Box, Text, VStack } from '@chakra-ui/react';
import TaskBoardItem from './TaskBoardItem';
import { IColumn } from '../../redux/columns/columnsTypes';

interface TaskBoardColumnProps {
  column: IColumn;
}

const TaskBoardColumn = ({ column }: TaskBoardColumnProps) => {
  const renderTaskItem = (item: any, index: number): JSX.Element => {
    return <TaskBoardItem key={index} task={item} />;
  };

  return (
    <VStack
      h="full"
      w="270px"
      backgroundColor="gray.100"
      borderRadius={8}
      position="relative"
      px={1.5}
    >
      <Box top={0} py={3} w="full" h="56px" alignItems="center" px={2}>
        <Text fontSize={12} fontWeight={600} color="gray.600">
          {column.name}
        </Text>
      </Box>
    </VStack>
  );
};

export default TaskBoardColumn;
