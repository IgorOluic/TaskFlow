import { VStack } from '@chakra-ui/react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectBoardTasksByColumnId } from '../../../redux/tasks/tasksSelectors';
import TaskBoardItem from './TaskBoardItem';
import { Droppable } from '@hello-pangea/dnd';

interface ColumnTaskListProps {
  columnId: string;
}

const ColumnTaskList = ({ columnId }: ColumnTaskListProps) => {
  const columnTaskIds = useAppSelector(selectBoardTasksByColumnId(columnId));

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
