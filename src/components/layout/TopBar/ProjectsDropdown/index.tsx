import {
  HStack,
  Text,
  VStack,
  Divider,
  Box,
  useOutsideClick,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { selectProjects } from '../../../../redux/projects/projectsSelectors';
import { IProject } from '../../../../redux/projects/projectsTypes';
import SvgIcon from '../../../ui/SvgIcon';
import DropdownProjectItem from './DropdownProjectItem';
import CustomLink from '../../../ui/CustomLink';
import useVisibilityControl from '../../../../hooks/useVisibilityControl';

const ProjectsDropdown = () => {
  const { isOpen, onToggle, onClose } = useVisibilityControl();
  const ref = useRef(null);

  useOutsideClick({ ref, handler: onClose });

  const projects = useAppSelector(selectProjects);

  const renderProjectItem = (project: IProject, index: number): JSX.Element => {
    return (
      <DropdownProjectItem project={project} key={index} onClose={onClose} />
    );
  };

  return (
    <Box position="relative" ref={ref} className="no-select">
      <HStack
        outline="none"
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

      {isOpen && (
        <VStack
          position="absolute"
          top="100%"
          mt={3}
          alignItems="flex-start"
          pb={2}
          pt={4}
          outline="none"
          bg="white"
          boxShadow="md"
          borderWidth={1}
          minW="400px"
          borderRadius={8}
        >
          <Text ml={4} fontSize={12} fontWeight={700} color="gray.600">
            Recent
          </Text>

          <VStack spacing={0} w="full">
            {projects.map(renderProjectItem)}
          </VStack>

          <Divider />

          <VStack spacing={0} w="full">
            <CustomLink to="/projects" w="full" px={4} py={2} onClick={onClose}>
              <Text fontSize={14} textDecoration="none !important">
                View all projects
              </Text>
            </CustomLink>

            <CustomLink
              to="/new-project"
              w="full"
              px={4}
              py={2}
              onClick={onClose}
            >
              <Text fontSize={14}>Create project</Text>
            </CustomLink>
          </VStack>
        </VStack>
      )}
    </Box>
  );
};

export default ProjectsDropdown;
