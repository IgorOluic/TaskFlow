import { HStack, VStack } from '@chakra-ui/react';
import { SideBar, SidebarItemType } from './SideBar';
import { Outlet, useParams } from 'react-router-dom';
import { SIDE_BAR_WIDTH } from '../../constants/layout';
import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { fetchProjectByKey } from '../../redux/projects/projectsSlice';

const sideBarItems: SidebarItemType[] = [
  {
    name: 'Home',
    iconName: 'board',
    path: '/',
  },
  {
    name: 'Backlog',
    iconName: 'board',
    path: '/backlog',
  },
  {
    name: 'Board',
    iconName: 'board',
    path: '/board',
  },
  {
    name: 'Timeline',
    iconName: 'calendar',
    path: '/timeline',
  },
];

export const ProjectLayout = () => {
  const { projectKey } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (projectKey) {
      dispatch(fetchProjectByKey({ key: projectKey, fetchColumns: true }));
    }
  }, [projectKey]);

  return (
    <HStack
      display="flex"
      alignItems="flex-start"
      flex={1}
      spacing={0}
      backgroundColor="white"
      w="full"
    >
      <SideBar items={sideBarItems} />

      <VStack
        flex={1}
        width="full"
        alignItems="flex-start"
        ml={`${SIDE_BAR_WIDTH}px`}
        h="full"
        position="relative"
      >
        <Outlet />
      </VStack>
    </HStack>
  );
};

export default ProjectLayout;
