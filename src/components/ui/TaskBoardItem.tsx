import { Box, Text, VStack } from '@chakra-ui/react';

interface TaskBoardItemProps {
  title: string;
  taskId: number;
  columnId: number;
}

const TaskBoardItem = ({ title, taskId, columnId }: TaskBoardItemProps) => {
  return (
    <VStack h="128px" w="full" backgroundColor="white" borderRadius={8}>
      <Box top={0}>
        <Text fontSize={12} fontWeight={600} color="gray.600">
          {title}
        </Text>
      </Box>
    </VStack>
  );
};

export default TaskBoardItem;
