import { HStack, Text, VStack } from '@chakra-ui/react';
import SvgIcon from '../SvgIcon';
import { TaskStatus } from '../../../redux/tasks/tasksTypes';
import TaskList from './TaskList';
import useVisibilityControl from '../../../hooks/useVisibilityControl';

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
      <HStack w="full" onClick={onToggle} cursor="pointer" py={2} px={2}>
        <SvgIcon name="chevronDown" width="12px" height="12px" />
        <Text fontSize={14} fontWeight={600}>
          {title}{' '}
          <Text as="span" fontSize={12} fontWeight={500} color="gray.600">
            {/* {nOfTasksText} */}
          </Text>
        </Text>
      </HStack>

      {isOpen && <TaskList status={status} />}
    </VStack>
  );
};

export default CollapsibleTaskList;
