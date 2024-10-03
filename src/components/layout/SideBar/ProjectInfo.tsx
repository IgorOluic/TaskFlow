import { HStack, Skeleton, SkeletonText, Text, VStack } from '@chakra-ui/react';
import SVGS from '../../../constants/SVGS';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectSelectedProject } from '../../../redux/projects/projectsSelectors';
import ProjectIcon from '../../ui/ProjectIcon';
import useIsLoading from '../../../hooks/useIsLoading';
import actions from '../../../constants/actions';

export type SidebarItemType = {
  name: string;
  iconName: keyof typeof SVGS;
  path: string;
};

export const ProjectInfo = () => {
  const selectedProject = useAppSelector(selectSelectedProject);
  const loading = useIsLoading(actions.fetchProjectByKey);

  return (
    <HStack w="full" px={4} h="80px" alignItems="center" cursor="default">
      <Skeleton isLoaded={!loading} borderRadius={6}>
        <ProjectIcon
          iconUrl={selectedProject?.iconUrl as string}
          defaultIconId={selectedProject?.defaultIconId as number}
          boxSize="40px"
        />
      </Skeleton>

      <VStack
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={0}
        w="full"
        h="40px"
        py={1}
      >
        <SkeletonText
          noOfLines={1}
          w="full"
          skeletonHeight={3}
          isLoaded={!loading}
        >
          <Text
            fontSize={14}
            fontWeight={600}
            lineHeight="14px"
            noOfLines={1}
            w="full"
          >
            {selectedProject?.name}
          </Text>
        </SkeletonText>

        <SkeletonText
          noOfLines={1}
          w="50%"
          skeletonHeight={2.5}
          isLoaded={!loading}
        >
          <Text fontSize={12} color="gray.600" lineHeight="12px">
            33 members
          </Text>
        </SkeletonText>
      </VStack>
    </HStack>
  );
};

export default ProjectInfo;
