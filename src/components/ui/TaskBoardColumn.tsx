import { Box, Text, VStack } from '@chakra-ui/react';
import TaskBoardItem from './TaskBoardItem';
import { selectColumnById } from '../../redux/columns/columnsSelectors';
import { useAppSelector } from '../../hooks/useAppSelector';

interface TaskBoardColumnProps {
  id: string;
}

const TaskBoardColumn = ({ id }: TaskBoardColumnProps) => {
  const renderTaskItem = (item: any, index: number): JSX.Element => {
    return <TaskBoardItem key={index} task={item} />;
  };

  const columnData = useAppSelector(selectColumnById(id));

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
          {columnData.name}
        </Text>
      </Box>
    </VStack>
  );
};

export default TaskBoardColumn;
