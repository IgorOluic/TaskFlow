import { HStack, Text } from '@chakra-ui/react';
import UserAvatar from '../UserAvatar';
import ColumnDropdown from '../ColumnDropdown';
import TaskMenu from '../TaskMenu';
import { ITask } from '../../../redux/tasks/tasksTypes';

interface TaskListItemProps {
  isLastItem: boolean;
  task: ITask;
  isBoard?: boolean;
}

const TaskListItem = ({ task, isLastItem, isBoard }: TaskListItemProps) => {
  return (
    <HStack
      w="full"
      borderBottomWidth={isLastItem ? 0 : 1}
      borderBottomColor="gray.300"
      pr={2}
      pl={4}
      py={2}
      justifyContent="space-between"
      _hover={{
        backgroundColor: 'purple.50',
      }}
      cursor="pointer"
    >
      <HStack>
        <Text fontSize={12} fontWeight={700} color="gray.600">
          {task.id}
        </Text>
        <Text fontSize={14} fontWeight={500}>
          {task.summary}
        </Text>
      </HStack>

      <HStack justifySelf="flex-end" spacing={2}>
        <ColumnDropdown small onChange={() => {}} />

        <UserAvatar firstName="Igor" lastName="Oluic" />

        <TaskMenu taskId={task.id} isBoard={isBoard} status={task.status} />
      </HStack>
    </HStack>
  );
};

export default TaskListItem;
