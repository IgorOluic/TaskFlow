import { HStack, Text, VStack } from '@chakra-ui/react';
import SvgIcon from '../SvgIcon';
import { useMemo, useState } from 'react';
import TaskListItem from './TaskListItem';

interface TaskListProps {
  taskIds: string[];
  title: string;
}

const TaskList = ({ taskIds, title }: TaskListProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const renderTaskItem = (id: string, index: number): JSX.Element => {
    const isLastItem = taskIds.length - 1 === index;
    return <TaskListItem key={index} id={id} isLastItem={isLastItem} />;
  };

  const nOfTasksText = useMemo(() => {
    return `(${taskIds.length} task${taskIds.length === 1 ? '' : 's'})`;
  }, [taskIds.length]);

  return (
    <VStack
      w="full"
      bg="gray.100"
      borderRadius={8}
      alignItems="flex-start"
      px={2}
      py={2}
    >
      <HStack
        w="full"
        onClick={() => setCollapsed(!collapsed)}
        cursor="pointer"
        py={2}
        px={2}
      >
        <SvgIcon name="chevronDown" width="12px" height="12px" />
        <Text fontSize={14} fontWeight={600}>
          {title}{' '}
          <Text as="span" fontSize={12} fontWeight={500} color="gray.600">
            {nOfTasksText}
          </Text>
        </Text>
      </HStack>

      {!collapsed && (
        <VStack
          w="full"
          alignItems="flex-start"
          backgroundColor="white"
          borderWidth={1}
          borderColor="gray.300"
          spacing={0}
        >
          {taskIds.map(renderTaskItem)}
        </VStack>
      )}
    </VStack>
  );
};

export default TaskList;
