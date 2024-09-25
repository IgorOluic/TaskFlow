import { VStack } from '@chakra-ui/react';
import SideBarItem from './SideBarItem';
import { memo } from 'react';
import SVGS from '../../constants/SVGS';

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
      top="56px"
      width={242}
      px={4}
      borderRightWidth={4}
      borderRightColor="gray.100"
    >
      <VStack w="full" spacing={0} py={6}>
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
    </VStack>
  );
};

export default memo(SideBar);
