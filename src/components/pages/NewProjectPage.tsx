import { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  Box,
  HStack,
  Text,
} from '@chakra-ui/react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { createNewProject } from '../../redux/projects/projectsSlice';

const NewProjectPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [key, setKey] = useState('');

  const dispatch = useAppDispatch();

  const handleCreateProject = () => {
    dispatch(createNewProject({ name, description, projectKey: key }));
  };

  return (
    <VStack w="full" alignItems="center" justifyContent="center" spacing={4}>
      <HStack w="full" justifyContent="space-between" alignItems="center">
        <Text fontSize={24} fontWeight={500}>
          New project
        </Text>
      </HStack>

      <VStack w="full" maxW="600px">
        <FormControl isRequired>
          <FormLabel>Project Name</FormLabel>
          <Input
            placeholder="Enter project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Short Description</FormLabel>
          <Textarea
            placeholder="Enter short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Project Key</FormLabel>
          <Input
            placeholder="Enter project key (e.g., ABC)"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </FormControl>

        <Box pt={4}>
          <Button colorScheme="teal" onClick={handleCreateProject}>
            Create Project
          </Button>
        </Box>
      </VStack>
    </VStack>
  );
};

export default NewProjectPage;
