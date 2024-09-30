import { VStack } from '@chakra-ui/react';
import TaskBoard from '../ui/TaskBoard';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useEffect } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchProjectColumns } from '../../redux/columns/columnsSlice';

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
    <VStack w="full">
      <TaskBoard />
    </VStack>
  );
};

export default BoardPage;
