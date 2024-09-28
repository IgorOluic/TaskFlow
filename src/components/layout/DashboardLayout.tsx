import { VStack } from '@chakra-ui/react';
import { SideBar, SidebarItemType } from './SideBar';
import { Outlet, useParams } from 'react-router-dom';
import TopBar from './TopBar';
import { SIDE_BAR_WIDTH, TOP_BAR_HEIGHT } from '../../constants/layout';
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

export const DashboardLayout = () => {
  const { projectKey } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (projectKey) {
      dispatch(fetchProjectByKey(projectKey));
    }
  }, [projectKey]);

  return (
    <VStack
      display="flex"
      minH="100vh"
      alignItems="flex-start"
      flex={1}
      spacing={0}
      backgroundColor="white"
    >
      <TopBar />

      <SideBar items={sideBarItems} />

      <VStack
        flex={1}
        width="full"
        alignItems="flex-start"
        ml={SIDE_BAR_WIDTH}
        maxW={`calc(100vw - ${SIDE_BAR_WIDTH}px)`}
        marginTop={`${TOP_BAR_HEIGHT}px`}
        position="relative"
        minH={`calc(100vh - ${TOP_BAR_HEIGHT}px)`}
      >
        <Outlet />

        {/* TO DO: FOOTER */}
      </VStack>
    </VStack>
  );
};

export default DashboardLayout;
