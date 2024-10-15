import { VStack } from '@chakra-ui/react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectColumnFilteredTaskIds } from '../../../redux/tasks/tasksSelectors';
import TaskBoardItem from './TaskBoardItem';
import { Droppable } from '@hello-pangea/dnd';
import { TaskStatus } from '../../../redux/tasks/tasksTypes';

interface ColumnTaskListProps {
  columnId: string;
}

const ColumnTaskList = ({ columnId }: ColumnTaskListProps) => {
  const columnTaskIds = useAppSelector(
    selectColumnFilteredTaskIds(TaskStatus.board, columnId),
  );

  const renderTaskItem = (taskId: string, index: number): JSX.Element => {
    return <TaskBoardItem key={taskId} taskId={taskId} index={index} />;
  };

  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <VStack
          w="full"
          h="full"
          ref={provided.innerRef}
          {...provided.droppableProps}
          backgroundColor={snapshot.isDraggingOver ? 'gray.200' : 'transparent'}
          borderRadius={8}
          spacing={0}
        >
          {columnTaskIds.map(renderTaskItem)}
          {provided.placeholder}
        </VStack>
      )}
    </Droppable>
  );
};

export default ColumnTaskList;
