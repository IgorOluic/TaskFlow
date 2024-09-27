import { VStack } from '@chakra-ui/react';
import TaskList from '../ui/TaskList';
import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { fetchBacklogTasks } from '../../redux/projects/projectsSlice';
import { useAppSelector } from '../../hooks/useAppSelector';

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
      <TaskList taskIds={[]} />
    </VStack>
  );
};

export default BacklogPage;
