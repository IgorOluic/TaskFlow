import { HStack, Text, VStack } from '@chakra-ui/react';
import SvgIcon from '../SvgIcon';
import { TaskStatus } from '../../../redux/tasks/tasksTypes';
import TaskList from './TaskList';
import useVisibilityControl from '../../../hooks/useVisibilityControl';
import TaskCount from './TaskCount';
import TaskCountPerColumn from './TaskCountPerColumn';

interface CollapsibleTaskListProps {
  title: string;
  status: TaskStatus;
}

const CollapsibleTaskList = ({ title, status }: CollapsibleTaskListProps) => {
  const { isOpen, onToggle } = useVisibilityControl(true);

  return (
    <VStack
      w="full"
      bg="gray.100"
      borderRadius={8}
      alignItems="flex-start"
      px={2}
      py={2}
      className="no-select"
    >
      <HStack
        w="full"
        py={2}
        px={2}
        alignItems="center"
        cursor="pointer"
        onClick={onToggle}
        justifyContent="space-between"
      >
        <HStack w="full" alignItems="center">
          <SvgIcon name="chevronDown" width="12px" height="12px" />
          <Text fontSize={14} fontWeight={600}>
            {title} <TaskCount status={status} />
          </Text>
        </HStack>

        <TaskCountPerColumn status={status} />
      </HStack>

      {isOpen && <TaskList status={status} />}
    </VStack>
  );
};

export default CollapsibleTaskList;
