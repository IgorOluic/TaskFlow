import { Box, Text, VStack } from '@chakra-ui/react';
import TaskBoardItem from './TaskBoardItem';

interface TaskBoardColumnProps {
  title: string;
  columnId: number;
  tasks: any[];
}

const TaskBoardColumn = ({ title, columnId, tasks }: TaskBoardColumnProps) => {
  const renderTaskItem = (item: any, index: number): JSX.Element => {
    return (
      <TaskBoardItem
        key={index}
        title={item.title}
        columnId={columnId}
        taskId={item.id}
      />
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
    >
      <Box top={0} py={3} w="full" h="56px" alignItems="center" px={2}>
        <Text fontSize={12} fontWeight={600} color="gray.600">
          {title}
        </Text>
      </Box>

      {tasks.map(renderTaskItem)}
    </VStack>
  );
};

export default TaskBoardColumn;
