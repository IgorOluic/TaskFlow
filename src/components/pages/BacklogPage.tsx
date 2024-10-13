import { Divider, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  fetchTasks,
  reorderTaskPosition,
  updateTaskStatusAndPosition,
} from '../../redux/tasks/tasksSlice';
import CollapsibleTaskList from '../ui/CollapsibleTaskList';
import Breadcrumbs from '../layout/Breadcrumbs';
import TaskFilters from '../ui/TaskFilters';
import { TaskStatus } from '../../redux/tasks/tasksTypes';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';

const BacklogPage = () => {
  const dispatch = useAppDispatch();
  const selectedProjectId = useAppSelector(
    (state) => state.projects.selectedProjectId,
  );

  useEffect(() => {
    if (selectedProjectId) {
      dispatch(fetchTasks({ projectId: selectedProjectId }));
    }
  }, [selectedProjectId]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    const isSameList = destination?.droppableId === source.droppableId;

    if (!destination || (isSameList && destination.index === source.index)) {
      return;
    }

    // TODO: Find a better way to do this
    const taskStatus =
      destination.droppableId === 'droppable-backlog'
        ? TaskStatus.backlog
        : TaskStatus.board;

    if (!isSameList) {
      const oldStatus =
        source.droppableId === 'droppable-backlog'
          ? TaskStatus.backlog
          : TaskStatus.board;

      dispatch(
        updateTaskStatusAndPosition({
          taskId: draggableId,
          droppedAtIndex: destination.index,
          newStatus: taskStatus,
          oldStatus,
        }),
      );
    } else {
      const isMovingDown = destination.index > source.index;

      dispatch(
        reorderTaskPosition({
          taskId: draggableId,
          droppedAtIndex: destination.index,
          taskStatus,
          isMovingDown,
        }),
      );
    }
  };

  return (
    <VStack w="full" alignItems="flex-start" p={5}>
      <Breadcrumbs />

      <TaskFilters />

      <DragDropContext onDragEnd={onDragEnd}>
        <CollapsibleTaskList title="Board" status={TaskStatus.board} />

        <Divider my={10} />

        <CollapsibleTaskList title="Backlog" status={TaskStatus.backlog} />
      </DragDropContext>
    </VStack>
  );
};

export default BacklogPage;
