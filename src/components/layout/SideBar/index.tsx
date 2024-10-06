import { Divider, VStack } from '@chakra-ui/react';
import { memo } from 'react';
import SVGS from '../../../constants/SVGS';
import { TOP_BAR_HEIGHT } from '../../../constants/layout';
import SideBarItem from './SideBarItem';
import ProjectInfo from './ProjectInfo';
import InvitePeopleModal from '../../modals/InvitePeople';

export type SidebarItemType = {
  name: string;
  iconName: keyof typeof SVGS;
  path: string;
};

type SideBarProps = {
  items: SidebarItemType[];
};

export const SideBar = ({ items }: SideBarProps) => {
  return (
    <VStack
      height="calc(100vh - 56px)"
      position="fixed"
      top={`${TOP_BAR_HEIGHT}px`}
      width={242}
      maxW={242}
      spacing={0}
      borderRightWidth={4}
      borderRightColor="gray.100"
      pb={10}
    >
      <ProjectInfo />

      <Divider />
      <VStack h="full" w="full" spacing={0} py={6} px={4}>
        {items?.map((item, index) => {
          return (
            <SideBarItem
              key={`${item.name}-${index}`}
              name={item.name}
              iconName={item.iconName}
              path={item.path}
            />
          );
        })}
      </VStack>

      <InvitePeopleModal />
    </VStack>
  );
};

export default memo(SideBar);
