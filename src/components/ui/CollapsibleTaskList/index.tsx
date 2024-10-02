import { HStack, Text, VStack } from '@chakra-ui/react';
import SvgIcon from '../SvgIcon';
import { useState } from 'react';
import {
  TaskStatusDataFields,
  TaskStatusIdsFields,
} from '../../../redux/tasks/tasksTypes';
import TaskList from './TaskList';

interface TaskListProps {
  title: string;
  idsField: TaskStatusIdsFields;
  dataField: TaskStatusDataFields;
}

const CollapsibleTaskList = ({ title, idsField, dataField }: TaskListProps) => {
  const [collapsed, setCollapsed] = useState(false);

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
            {/* {nOfTasksText} */}
          </Text>
        </Text>
      </HStack>

      {!collapsed && <TaskList idsField={idsField} dataField={dataField} />}
    </VStack>
  );
};

export default CollapsibleTaskList;
