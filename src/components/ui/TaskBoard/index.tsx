import { HStack } from '@chakra-ui/react';
import TaskBoardColumn from './TaskBoardColumn';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectColumnIds } from '../../../redux/columns/columnsSelectors';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import {
  reorderTaskPositionInColumn,
  updateTaskColumnAndPosition,
} from '../../../redux/tasks/tasksSlice';
import { TaskStatus } from '../../../redux/tasks/tasksTypes';

const TaskBoard = () => {
  const dispatch = useAppDispatch();
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
      const isMovingDown = destination.index > source.index;

      dispatch(
        reorderTaskPositionInColumn({
          taskId: draggableId,
          droppedAtIndex: destination.index,
          taskStatus: TaskStatus.board,
          isMovingDown,
          columnId: destination.droppableId,
        }),
      );
    } else {
      dispatch(
        updateTaskColumnAndPosition({
          taskId: draggableId,
          droppedAtIndex: destination.index,
          taskStatus: TaskStatus.board,
          oldColumnId: source.droppableId,
          newColumnId: destination.droppableId,
        }),
      );
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
