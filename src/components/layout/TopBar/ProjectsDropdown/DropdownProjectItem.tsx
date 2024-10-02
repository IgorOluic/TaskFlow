import { HStack, Text } from '@chakra-ui/react';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import { IProject } from '../../../../redux/projects/projectsTypes';
import ProjectIcon from '../../../ui/ProjectIcon';

interface DropdownProjectItemProps {
  project: IProject;
  onClose: () => void;
}

const DropdownProjectItem = ({
  project,
  onClose,
}: DropdownProjectItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleProjectClick = () => {
    onClose();
    const newPath = generatePath('/projects/:projectKey/*', {
      projectKey: project.key,
      '*': location.pathname.split('/').slice(3).join('/'),
    });
    navigate(newPath);
  };

  return (
    <HStack
      _hover={{ backgroundColor: 'gray.100' }}
      cursor="pointer"
      w="full"
      px={4}
      py={2}
      fontSize={16}
      onClick={handleProjectClick}
    >
      <ProjectIcon
        iconUrl={project?.iconUrl}
        defaultIconId={project.defaultIconId}
      />
      <Text fontSize={14} fontWeight={500} noOfLines={1}>
        {project.name}
      </Text>
    </HStack>
  );
};

export default DropdownProjectItem;
