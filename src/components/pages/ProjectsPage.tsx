import { Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import ProjectsTable from '../renderers/ProjectsTable/ProjectsTable';
import { useNavigate } from 'react-router-dom';

const ProjectsPage = () => {
  const navigate = useNavigate();

  const handleCreateProject = () => {
    navigate('/new-project');
  };

  return (
    <VStack
      w="full"
      alignItems="flex-start"
      justifyContent="center"
      spacing={10}
      px={8}
      pt={8}
    >
      <HStack w="full" justifyContent="space-between" alignItems="center">
        <Text fontSize={24} fontWeight={500}>
          Projects
        </Text>

        <Button onClick={handleCreateProject}>Create project</Button>
      </HStack>

      <Input maxW="250px" placeholder="Search Projects" />

      <ProjectsTable />
    </VStack>
  );
};

export default ProjectsPage;
