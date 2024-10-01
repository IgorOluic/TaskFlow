import { Center, HStack, Text } from '@chakra-ui/react';
import SvgIcon from '../SvgIcon';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectBacklogTaskById } from '../../../redux/tasks/tasksSelectors';

interface TaskListItemProps {
  id: string;
  isLastItem: boolean;
}

const TaskListItem = ({ id, isLastItem }: TaskListItemProps) => {
  const taskData = useAppSelector(selectBacklogTaskById(id));

  return (
    <HStack
      justifyContent="space-between"
      w="full"
      borderBottomWidth={isLastItem ? 0 : 1}
      borderBottomColor="gray.300"
      px={4}
      py={2}
    >
      <Text>{taskData.summary}</Text>

      <Center w={6} h={6} borderRadius="full" backgroundColor="green">
        <SvgIcon name="calendar" width="16px" height="16px" />
      </Center>
    </HStack>
  );
};

export default TaskListItem;
