import { Divider, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  fetchBacklogTasks,
  fetchBoardTasks,
  updateTaskPosition,
} from '../../redux/tasks/tasksSlice';
import CollapsibleTaskList from '../ui/CollapsibleTaskList';
import {
  BACKLOG_TASKS_DATA,
  BACKLOG_TASK_IDS,
  BOARD_TASKS_DATA,
  BOARD_TASK_IDS,
} from '../../constants/tasks';
import Breadcrumbs from '../layout/Breadcrumbs';
import TaskFilters from '../ui/TaskFilters';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { TaskStatus } from '../../redux/tasks/tasksTypes';

const BacklogPage = () => {
  const dispatch = useAppDispatch();
  const selectedProjectId = useAppSelector(
    (state) => state.projects.selectedProjectId,
  );

  useEffect(() => {
    if (selectedProjectId) {
      dispatch(fetchBacklogTasks({ projectId: selectedProjectId }));
      dispatch(fetchBoardTasks({ projectId: selectedProjectId }));
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
      // TODO: Handle item dropping to a different list
    } else {
      dispatch(
        updateTaskPosition({
          taskId: draggableId,
          newIndex: destination.index,
          taskStatus,
        }),
      );
    }
  };

  return (
    <VStack w="full" alignItems="flex-start" p={5}>
      <Breadcrumbs />

      <TaskFilters />

      <DragDropContext onDragEnd={onDragEnd}>
        <CollapsibleTaskList
          title="Board"
          idsField={BOARD_TASK_IDS}
          dataField={BOARD_TASKS_DATA}
        />

        <Divider my={10} />

        <CollapsibleTaskList
          title="Backlog"
          idsField={BACKLOG_TASK_IDS}
          dataField={BACKLOG_TASKS_DATA}
        />
      </DragDropContext>
    </VStack>
  );
};

export default BacklogPage;
