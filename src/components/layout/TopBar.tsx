import { HStack, Text } from '@chakra-ui/react';
import { memo, useEffect } from 'react';
import ProfileMenu from './ProfileMenu';
import ProjectsPopover from './ProjectsPopover';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { fetchProjects } from '../../redux/projects/projectsSlice';
import NewTaskModal from '../modals/NewTaskModal';

export const TopBar = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProjects());
  }, []);

  return (
    <HStack
      w="full"
      h="56px"
      borderBottomWidth={1}
      borderBottomColor="gray.100"
      position="fixed"
      top={0}
      px={4}
      backgroundColor="white"
      zIndex={10}
      alignItems="center"
      justifyContent="space-between"
    >
      <HStack>
        <HStack
          spacing={3}
          role="group"
          cursor="pointer"
          justifyContent="flex-start"
        >
          <Text color="gray.900" fontSize={20} fontWeight={500}>
            TaskFlow
          </Text>
        </HStack>

        <ProjectsPopover />

        <NewTaskModal />
      </HStack>

      <ProfileMenu />
    </HStack>
  );
};

export default memo(TopBar);
