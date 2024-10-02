import { useRef, useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  Text,
} from '@chakra-ui/react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { createNewProject } from '../../redux/projects/projectsSlice';
import IconSelection from '../ui/IconSelection/IconSelection';
import { dataURLtoBlob } from '../../utils/commonUtils';

const NewProjectPage = () => {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const selectedIcon = useRef<number | null>(null);
  const selectedImage = useRef<string | null>(null);

  const setSelectedImage = (image: string | null) => {
    selectedImage.current = image;
  };

  const setSelectedIcon = (id: number | null) => {
    selectedIcon.current = id;
  };

  const dispatch = useAppDispatch();

  const handleCreateProject = () => {
    let file = null;

    if (selectedImage.current) {
      const blob = dataURLtoBlob(selectedImage.current);
      file = new File([blob], 'cropped-image.png', { type: 'image/png' });
    }

    dispatch(
      createNewProject({
        name,
        projectKey: key,
        defaultIconId: selectedIcon.current,
        image: file,
      }),
    );
  };

  return (
    <VStack w="full" alignItems="center" justifyContent="center" spacing={4}>
      <HStack
        mt={20}
        w="full"
        maxW="800px"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <VStack maxW="500px" w="full" alignItems="flex-start">
          <Text fontSize={24} fontWeight={500}>
            Add project details
          </Text>

          <Text>
            Explore what&apos;s possible when you collaborate with your team.
            Edit project details anytime in project settings.
          </Text>

          <FormControl isRequired>
            <FormLabel>Project Name</FormLabel>
            <Input
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
        </VStack>

        <IconSelection
          setSelectedIcon={setSelectedIcon}
          setSelectedImage={setSelectedImage}
        />
      </HStack>

      <HStack
        w="full"
        maxW="800px"
        justifyContent="flex-end"
        borderTopWidth={1}
        pt={4}
      >
        <Button colorScheme="teal" alignSelf="flex-end">
          Cancel
        </Button>

        <Button colorScheme="teal" onClick={handleCreateProject}>
          Create Project
        </Button>
      </HStack>
    </VStack>
  );
};

export default NewProjectPage;
