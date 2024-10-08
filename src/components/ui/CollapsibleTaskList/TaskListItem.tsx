import { HStack, Text } from '@chakra-ui/react';
import ColumnDropdown from '../ColumnDropdown';
import { TaskStatusDataFields } from '../../../redux/tasks/tasksTypes';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectTaskByIdAndField } from '../../../redux/tasks/tasksSelectors';
import TaskListItemMenu from './TaskListItemMenu';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { moveTaskToColumn } from '../../../redux/tasks/tasksSlice';
import TinyAssigneeSelection from '../AssigneeSelection/TinyAssigneeSelection';

interface TaskListItemProps {
  isLastItem: boolean;
  taskId: string;
  dataField: TaskStatusDataFields;
}

const TaskListItem = ({ taskId, isLastItem, dataField }: TaskListItemProps) => {
  const dispatch = useAppDispatch();
  const task = useAppSelector(selectTaskByIdAndField(dataField, taskId));

  const onColumnChange = (newColumnId: string) => {
    dispatch(moveTaskToColumn({ taskId, newColumnId, dataField }));
  };

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
        <ColumnDropdown
          initialColumn={task.columnId}
          small
          onChange={onColumnChange}
        />

        <TinyAssigneeSelection
          unassigned={!task.assignedTo}
          assigneeId={task.assignedTo}
          taskId={task.id}
          dataField={dataField}
        />

        <TaskListItemMenu taskId={task.id} status={task.status} />
      </HStack>
    </HStack>
  );
};

export default TaskListItem;
