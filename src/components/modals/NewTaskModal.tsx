import { ChangeEvent, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { createTask } from '../../redux/tasks/tasksSlice';
import ColumnDropdown from '../ui/ColumnDropdown';
import RichTextEditor from '../ui/RichTextEditor/RichTextEditor';
import { useParams } from 'react-router-dom';

const NewTaskModal = () => {
  const { selectedProjectId } = useAppSelector((state) => state.projects);
  const { projectKey } = useParams();

  const newData = useRef({ summary: '', columnId: '', description: '' });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();

  const handleCreateTask = () => {
    if (selectedProjectId && projectKey) {
      dispatch(
        createTask({
          projectId: selectedProjectId,
          projectKey,
          ...newData.current,
        }),
      );
    }
  };

  const onColumnChange = (id: string) => {
    newData.current = { ...newData.current, columnId: id };
  };

  const onSummaryChange = (e: ChangeEvent<HTMLInputElement>) => {
    newData.current = { ...newData.current, summary: e.target.value };
  };

  const onDescriptionChange = (content: string) => {
    newData.current = { ...newData.current, description: content };
  };

  return (
    <>
      <Button onClick={onOpen}>Add Task</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h="80vh" minW="700px">
          <ModalHeader>Create New Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="scroll">
            <VStack w="full" alignItems="flex-start" spacing={6}>
              <ColumnDropdown onChange={onColumnChange} />

              <FormControl>
                <FormLabel>Summary</FormLabel>
                <Input
                  onChange={onSummaryChange}
                  placeholder="Enter summary"
                  autoFocus
                />
              </FormControl>

              <RichTextEditor onChange={onDescriptionChange} />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" ml={3} onClick={handleCreateTask}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewTaskModal;
