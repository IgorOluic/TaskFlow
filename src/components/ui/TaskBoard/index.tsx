import { HStack } from '@chakra-ui/react';
import TaskBoardColumn from './TaskBoardColumn';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectColumnIds } from '../../../redux/columns/columnsSelectors';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';

const TaskBoard = () => {
  const columnIds = useAppSelector(selectColumnIds);

  const renderColumnItem = (columnId: string, index: number): JSX.Element => {
    return <TaskBoardColumn key={index} id={columnId} />;
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    const isSameColumn = destination?.droppableId === source.droppableId;

    if (!destination || (isSameColumn && destination.index === source.index)) {
      return;
    }

    console.log(destination, source, draggableId);

    if (isSameColumn) {
      // TODO: update task position when moving in the same column
    } else {
      // TODO: update task position when moving to a different column
    }
  };

  return (
    <HStack w="full" h="500px" overflowX="scroll" className="no-select">
      <DragDropContext onDragEnd={onDragEnd}>
        {columnIds.map(renderColumnItem)}
      </DragDropContext>
    </HStack>
  );
};

export default TaskBoard;
