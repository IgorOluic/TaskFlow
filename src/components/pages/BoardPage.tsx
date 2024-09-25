import { VStack } from '@chakra-ui/react';
import TaskBoard from '../ui/TaskBoard';

const BoardPage = () => {
  return (
    <VStack w="full">
      <TaskBoard />
    </VStack>
  );
};

export default BoardPage;
