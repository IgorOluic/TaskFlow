import { HStack, VStack } from '@chakra-ui/react';
import { SideBar, SidebarItemType } from './SideBar';
import { Outlet, useParams } from 'react-router-dom';
import { SIDE_BAR_WIDTH } from '../../constants/layout';
import { memo, useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { fetchProjectByKey } from '../../redux/projects/projectsSlice';
import { useTrackProjectMembers } from '../../hooks/useTrackProjectMembers';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectSelectedProjectId } from '../../redux/projects/projectsSelectors';
import { fetchTasks } from '../../redux/tasks/tasksSlice';

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

const withProjectData = (WrappedComponent: React.ComponentType) => {
  const ProjectDataWrapper = () => {
    const { projectKey } = useParams();
    const dispatch = useAppDispatch();

    useEffect(() => {
      if (projectKey) {
        dispatch(fetchProjectByKey({ key: projectKey, fetchColumns: true }));
      }
    }, [projectKey, dispatch]);

    useTrackProjectMembers();

    const selectedProjectId = useAppSelector(selectSelectedProjectId);

    useEffect(() => {
      if (selectedProjectId) {
        dispatch(fetchTasks({ projectId: selectedProjectId }));
      }
    }, [selectedProjectId]);

    return <WrappedComponent />;
  };

  ProjectDataWrapper.displayName = `withProjectData(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ProjectDataWrapper;
};

export const ProjectLayout = () => {
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

export default withProjectData(memo(ProjectLayout));
