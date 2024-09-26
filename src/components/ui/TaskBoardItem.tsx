import { Box, Text, VStack } from '@chakra-ui/react';

interface TaskBoardItemProps {
  task: any;
}

const TaskBoardItem = ({ task }: TaskBoardItemProps) => {
  return (
    <VStack h="128px" w="full" backgroundColor="white" borderRadius={8}>
      <Box top={0}>
        <Text fontSize={12} fontWeight={600} color="gray.600">
          {task.title}
        </Text>
      </Box>
    </VStack>
  );
};

export default TaskBoardItem;
