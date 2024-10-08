import { ChangeEvent, useEffect, useRef, useState } from 'react';
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
  VStack,
} from '@chakra-ui/react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { createTask } from '../../redux/tasks/tasksSlice';
import ColumnDropdown from '../ui/ColumnDropdown';
import RichTextEditor from '../ui/RichTextEditor';
import { selectSelectedProjectId } from '../../redux/projects/projectsSelectors';
import AssigneeSelection from '../ui/AssigneeSelection';
import { fetchProjectMembers } from '../../redux/members/membersSlice';

const NewTaskModal = () => {
  const dispatch = useAppDispatch();
  const selectedProjectId = useAppSelector(selectSelectedProjectId);

  const newData = useRef<{
    summary: string;
    columnId: string;
    description: string;
    assignee: string | null;
  }>({
    summary: '',
    columnId: '',
    description: '',
    assignee: null,
  });

  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const handleCreateTask = () => {
    if (selectedProjectId) {
      dispatch(
        createTask({
          projectId: selectedProjectId,
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

  const onAssigneeChange = (value: string | null) => {
    newData.current = { ...newData.current, assignee: value };
  };

  useEffect(() => {
    if (selectedProjectId && isOpen) {
      console.log('called');
      dispatch(fetchProjectMembers(selectedProjectId));
    }
  }, [isOpen]);

  return (
    <>
      <Button onClick={onOpen}>Add Task</Button>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent h="80vh" minW="700px">
            <ModalHeader>Create New Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody overflowY="scroll">
              <VStack w="full" alignItems="flex-start" spacing={6} pb={20}>
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

                <AssigneeSelection
                  withLabel
                  onAssigneeChange={onAssigneeChange}
                />
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
      )}
    </>
  );
};

export default NewTaskModal;
