import { ChangeEvent, useRef, useState } from 'react';
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
  Text,
} from '@chakra-ui/react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { inviteToProject } from '../../redux/projects/projectsSlice';

const InvitePeopleModal = () => {
  const dispatch = useAppDispatch();
  const emailValue = useRef('');

  const onEmailValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    emailValue.current = e.target.value;
  };

  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const handleAddClick = () => {
    if (emailValue.current) {
      dispatch(inviteToProject({ email: emailValue.current }));
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="gray">
        Invite people
      </Button>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent minW="400px">
            <ModalHeader>Add people to your project</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Email</FormLabel>

                <Input onChange={onEmailValueChange} />
              </FormControl>

              <Text mt={2} fontSize={12} color="gray.500">
                They will recieve an invitation to your project.
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" ml={3} onClick={handleAddClick}>
                Add
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default InvitePeopleModal;
