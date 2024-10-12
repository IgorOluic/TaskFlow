import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectTaskByStatusAndId } from '../../../redux/tasks/tasksSelectors';
import TinyAssigneeSelection from '../AssigneeSelection/TinyAssigneeSelection';
import { Draggable } from '@hello-pangea/dnd';
import { memo } from 'react';
import { TaskStatus } from '../../../redux/tasks/tasksTypes';

interface TaskBoardItemProps {
  taskId: string;
}

const TaskBoardItem = ({ taskId }: TaskBoardItemProps) => {
  const task = useAppSelector(
    selectTaskByStatusAndId(TaskStatus.board, taskId),
  );

  return (
    <VStack w="full">
      <Flex flex={1} w="full" mb={2}>
        <Text fontSize={14}>{task.summary}</Text>
      </Flex>

      <HStack w="full" alignItems="center" justifyContent="space-between">
        <Text fontSize={12} fontWeight={600}>
          {task.id}
        </Text>

        <TinyAssigneeSelection
          taskId={task.id}
          assigneeId={task.assignedTo}
          status={TaskStatus.board}
        />
      </HStack>
    </VStack>
  );
};

interface DraggableTaskBoardItemProps {
  taskId: string;
  index: number;
}

// TODO: Possibly merge this with existing withDraggable and use it in both places

const withDraggable = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return ({ taskId, index, ...props }: DraggableTaskBoardItemProps) => {
    return (
      <Draggable draggableId={taskId} index={index}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            w="full"
            mb={2}
            backgroundColor={snapshot.isDragging ? 'purple.100' : 'white'}
            borderRadius={8}
            p={2}
            borderWidth={1}
            cursor="pointer"
            borderColor="gray.200"
          >
            <WrappedComponent taskId={taskId} {...(props as P)} />
          </Box>
        )}
      </Draggable>
    );
  };
};

export default withDraggable(memo(TaskBoardItem));
