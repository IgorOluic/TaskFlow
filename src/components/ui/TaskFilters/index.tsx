import { HStack } from '@chakra-ui/react';
import TaskSearchInput from './TaskSearchInput';

const TaskFilters = () => {
  return (
    <HStack mt={6} mb={2}>
      <TaskSearchInput />
    </HStack>
  );
};

export default TaskFilters;
