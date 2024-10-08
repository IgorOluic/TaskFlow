import { Divider, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  fetchBacklogTasks,
  fetchBoardTasks,
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

  return (
    <VStack w="full" alignItems="flex-start" p={5}>
      <Breadcrumbs />

      <TaskFilters />
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
    </VStack>
  );
};

export default BacklogPage;
