import { HStack, Text } from '@chakra-ui/react';
import UserAvatar from '../UserAvatar';
import ColumnDropdown from '../ColumnDropdown';
import { TaskStatusDataFields } from '../../../redux/tasks/tasksTypes';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectTaskByIdAndField } from '../../../redux/tasks/tasksSelectors';
import TaskListItemMenu from './TaskListItemMenu';

interface TaskListItemProps {
  isLastItem: boolean;
  taskId: string;
  dataField: TaskStatusDataFields;
}

const TaskListItem = ({ taskId, isLastItem, dataField }: TaskListItemProps) => {
  const task = useAppSelector(selectTaskByIdAndField(dataField, taskId));

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

        <TaskListItemMenu taskId={task.id} status={task.status} />
      </HStack>
    </HStack>
  );
};

export default TaskListItem;
