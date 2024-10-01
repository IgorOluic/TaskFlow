import { VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchBacklogTasks } from '../../redux/tasks/tasksSlice';
import BacklogTasksList from '../renderers/BacklogTasksList';

const BacklogPage = () => {
  const dispatch = useAppDispatch();
  const selectedProjectId = useAppSelector(
    (state) => state.projects.selectedProjectId,
  );

  useEffect(() => {
    if (selectedProjectId) {
      dispatch(fetchBacklogTasks({ projectId: selectedProjectId }));
    }
  }, [selectedProjectId]);

  return (
    <VStack
      w="full"
      alignItems="flex-start"
      px={5}
      pt={5}
      justifyContent="center"
    >
      <BacklogTasksList />
    </VStack>
  );
};

export default BacklogPage;
