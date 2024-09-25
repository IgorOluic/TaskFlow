import { VStack } from '@chakra-ui/react';
import { SideBar, SidebarItemType } from './SideBar';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import { SIDE_BAR_WIDTH, TOP_BAR_HEIGHT } from '../../constants/layout';

const sideBarItems: SidebarItemType[] = [
  {
    name: 'Board',
    iconName: 'board',
    path: '/',
  },
  {
    name: 'Timeline',
    iconName: 'calendar',
    path: '/timeline',
  },
];

export const DashboardLayout = () => {
  const containerBgColor = 'white';

  return (
    <VStack
      display="flex"
      minH="100vh"
      alignItems="flex-start"
      flex={1}
      spacing={0}
      backgroundColor={containerBgColor}
    >
      <TopBar />

      <SideBar items={sideBarItems} />

      <VStack
        flex={1}
        width="full"
        alignItems="flex-start"
        ml={SIDE_BAR_WIDTH}
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
