import { Divider, HStack, Text, VStack } from '@chakra-ui/react';
import SideBarItem from './SideBarItem';
import { memo } from 'react';
import SVGS from '../../constants/SVGS';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectSelectedProject } from '../../redux/projects/projectsSelectors';
import ProjectIcon from '../ui/ProjectIcon';
import { TOP_BAR_HEIGHT } from '../../constants/layout';

export type SidebarItemType = {
  name: string;
  iconName: keyof typeof SVGS;
  path: string;
};

type SideBarProps = {
  items: SidebarItemType[];
};

export const SideBar = ({ items }: SideBarProps) => {
  const selectedProject = useAppSelector(selectSelectedProject);

  return (
    <VStack
      height="calc(100vh - 56px)"
      position="fixed"
      top={`${TOP_BAR_HEIGHT}px`}
      width={242}
      spacing={0}
      borderRightWidth={4}
      borderRightColor="gray.100"
    >
      <HStack w="full" py={4} px={4}>
        {selectedProject && (
          <ProjectIcon
            iconUrl={selectedProject.iconUrl}
            defaultIconId={selectedProject.defaultIconId}
            boxSize="40px"
          />
        )}
        <VStack alignItems="flex-start" spacing={0}>
          <Text fontSize={14} fontWeight={500}>
            {selectedProject?.name}
          </Text>
          <Text fontSize={12} color="gray.600">
            33 members
          </Text>
        </VStack>
      </HStack>

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
    </VStack>
  );
};

export default memo(SideBar);
