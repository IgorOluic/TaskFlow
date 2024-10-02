import { Divider, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  fetchBacklogTasks,
  fetchBoardTasks,
} from '../../redux/tasks/tasksSlice';
import BacklogTasksList from '../renderers/BacklogTasksList';
import BoardTasksList from '../renderers/BoardTasksList';

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
    <VStack
      w="full"
      alignItems="flex-start"
      px={5}
      pt={5}
      justifyContent="center"
    >
      <BoardTasksList />

      <Divider my={10} />

      <BacklogTasksList />
    </VStack>
  );
};

export default BacklogPage;
