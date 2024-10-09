import { VStack } from '@chakra-ui/react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useEffect } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchProjectColumns } from '../../redux/columns/columnsSlice';
import TaskBoard from '../ui/TaskBoard';
import Breadcrumbs from '../layout/Breadcrumbs';
import TaskFilters from '../ui/TaskFilters';

const BoardPage = () => {
  const selectedProjectId = useAppSelector(
    (state) => state.projects.selectedProjectId,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectedProjectId) {
      dispatch(fetchProjectColumns(selectedProjectId));
    }
  }, [selectedProjectId]);

  return (
    <VStack w="full" alignItems="flex-start" p={5}>
      <Breadcrumbs />

      <TaskFilters />

      <TaskBoard />
    </VStack>
  );
};

export default BoardPage;
