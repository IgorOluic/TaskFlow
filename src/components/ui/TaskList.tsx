import { HStack, Text, VStack } from '@chakra-ui/react';
import { useAppSelector } from '../../hooks/useAppSelector';
import SvgIcon from './SvgIcon';
import { useMemo, useState } from 'react';
import TaskListItem from './TaskListItem';

interface TaskListProps {
  taskIds: string[];
}

const TaskList = ({ taskIds }: TaskListProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const { backlogTasks } = useAppSelector((state) => state.tasks);

  const renderTaskItem = (task: any, index: number): JSX.Element => {
    const isLastItem = backlogTasks.length - 1 === index;
    return <TaskListItem key={index} task={task} isLastItem={isLastItem} />;
  };

  const nOfTasksText = useMemo(() => {
    return `(${backlogTasks.length} task${backlogTasks.length === 1 ? '' : 's'})`;
  }, [backlogTasks.length]);

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
          Board{' '}
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
          {backlogTasks.map(renderTaskItem)}
        </VStack>
      )}
    </VStack>
  );
};

export default TaskList;
