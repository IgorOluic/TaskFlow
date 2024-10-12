import { VStack, HStack, Text } from '@chakra-ui/react';
import ColumnDropdown from '../ColumnDropdown';
import { ITask, TaskStatus } from '../../../redux/tasks/tasksTypes';
import TaskListItemMenu from './TaskListItemMenu';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { moveTaskToColumn } from '../../../redux/tasks/tasksSlice';
import TinyAssigneeSelection from '../AssigneeSelection/TinyAssigneeSelection';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectTaskByStatusAndId } from '../../../redux/tasks/tasksSelectors';
import { Draggable } from '@hello-pangea/dnd';
import { memo } from 'react';

interface DraggableProps {
  taskId: string;
  status: TaskStatus;
  index: number;
}

const withDraggable = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return ({ taskId, status, index, ...props }: DraggableProps) => {
    const task = useAppSelector(selectTaskByStatusAndId(status, taskId));

    return (
      <Draggable draggableId={taskId} index={index}>
        {(provided, snapshot) => (
          <VStack
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            w="full"
            bg={snapshot.isDragging ? 'purple.100' : 'white'}
            borderBottomWidth={1}
            borderBottomColor="gray.300"
            data-extra-info="asd"
          >
            <WrappedComponent task={task} status={status} {...(props as P)} />
          </VStack>
        )}
      </Draggable>
    );
  };
};

interface TaskListItemProps {
  task: ITask;
  status: TaskStatus;
}

const TaskListItem = ({ task, status }: TaskListItemProps) => {
  const dispatch = useAppDispatch();

  const onColumnChange = (newColumnId: string) => {
    dispatch(
      moveTaskToColumn({ taskId: task.id, newColumnId, taskStatus: status }),
    );
  };

  return (
    <HStack w="full" pr={2} pl={4} py={2} justifyContent="space-between">
      <HStack h="full">
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
          status={status}
        />

        <TaskListItemMenu taskId={task.id} status={task.status} />
      </HStack>
    </HStack>
  );
};

// Using HOC here to prevent unnecessary rerenders while dragging
export default withDraggable(memo(TaskListItem));
