import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
  HStack,
  Text,
  VStack,
  Divider,
} from '@chakra-ui/react';
import SvgIcon from '../ui/SvgIcon';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setSelectedProjectId } from '../../redux/projects/projectsSlice';
import { IProject } from '../../redux/projects/projectsTypes';
import { useNavigate } from 'react-router-dom';

const ProjectsPopover = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);

  const { isOpen, onClose, onToggle } = useDisclosure();

  const handleViewAllProjectsClick = () => {
    navigate('/projects');
  };

  const handleCreateProjectClick = () => {
    navigate('/projects/new');
  };

  const renderProjectItem = (item: IProject, index: number): JSX.Element => {
    const handleProjectClick = () => {
      dispatch(setSelectedProjectId(item.id));
      onClose();
    };

    return (
      <HStack
        key={index}
        _hover={{ backgroundColor: 'gray.100' }}
        cursor="pointer"
        w="full"
        px={4}
        py={2}
        fontSize={16}
        onClick={handleProjectClick}
      >
        <Text>{item.name}</Text>
      </HStack>
    );
  };

  return (
    <Popover isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <HStack
          onClick={onToggle}
          cursor="pointer"
          py={2}
          px={3}
          borderRadius={8}
          _hover={{
            backgroundColor: 'gray.200',
          }}
        >
          <Text fontWeight={500} fontSize={14}>
            Projects
          </Text>

          <SvgIcon name="chevronDown" width="12px" height="12px" />
        </HStack>
      </PopoverTrigger>

      <PopoverContent>
        <VStack alignItems="flex-start" pb={2} pt={4}>
          <Text ml={4} fontSize={12} fontWeight={700} color="gray.600">
            Recent
          </Text>

          <VStack spacing={0} w="full">
            {projects.map(renderProjectItem)}
          </VStack>

          <Divider />

          <VStack spacing={0} w="full">
            <HStack
              _hover={{ backgroundColor: 'gray.100' }}
              cursor="pointer"
              w="full"
              px={4}
              py={2}
              onClick={handleViewAllProjectsClick}
            >
              <Text fontSize={14}>View all projects</Text>
            </HStack>

            <HStack
              _hover={{ backgroundColor: 'gray.100' }}
              cursor="pointer"
              w="full"
              px={4}
              py={2}
              onClick={handleCreateProjectClick}
            >
              <Text fontSize={14}>Create project</Text>
            </HStack>
          </VStack>
        </VStack>
      </PopoverContent>
    </Popover>
  );
};

export default ProjectsPopover;
