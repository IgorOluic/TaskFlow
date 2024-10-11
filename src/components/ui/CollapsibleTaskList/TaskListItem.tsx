import { HStack, Text } from '@chakra-ui/react';
import ColumnDropdown from '../ColumnDropdown';
import { ITask, TaskStatusDataFields } from '../../../redux/tasks/tasksTypes';
import TaskListItemMenu from './TaskListItemMenu';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { moveTaskToColumn } from '../../../redux/tasks/tasksSlice';
import TinyAssigneeSelection from '../AssigneeSelection/TinyAssigneeSelection';
import { memo, forwardRef } from 'react';

interface TaskListItemProps {
  task: ITask;
  dataField: TaskStatusDataFields;
}

const TaskListItem = forwardRef<HTMLDivElement, TaskListItemProps>(
  function TaskListItem({ task, dataField }, ref) {
    const dispatch = useAppDispatch();

    const onColumnChange = (newColumnId: string) => {
      dispatch(moveTaskToColumn({ taskId: task.id, newColumnId, dataField }));
    };

    return (
      <HStack w="full" pr={2} pl={4} py={2} justifyContent="space-between">
        <HStack h="full" ref={ref}>
          <Text fontSize={12} fontWeight={700} color="gray.600" noOfLines={1}>
            {task.id}
          </Text>
          <Text fontSize={14} fontWeight={500} noOfLines={1}>
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
  },
);

export default memo(TaskListItem);
