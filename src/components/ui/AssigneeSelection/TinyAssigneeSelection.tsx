import { Box, VStack, useOutsideClick } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import UserAvatar, { UserAvatarProps } from '../UserAvatar';
import AssigneeSelection from '.';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectMemberById } from '../../../redux/members/membersSelectors';
import { setTaskAssignee } from '../../../redux/tasks/tasksSlice';
import { TaskStatusDataFields } from '../../../redux/tasks/tasksTypes';

interface TinyAssigneeSelectionProps extends UserAvatarProps {
  taskId: string;
  assigneeId: string | null;
  dataField: TaskStatusDataFields;
}

const TinyAssigneeSelection = ({
  taskId,
  assigneeId,
  dataField,
  ...props
}: TinyAssigneeSelectionProps) => {
  const dispatch = useAppDispatch();
  const memberData = useAppSelector(selectMemberById(assigneeId));
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const onOpen = () => {
    setIsOpen(true);
  };

  useOutsideClick({ ref, handler: () => setIsOpen(false) });

  const onAssigneeChange = (memberId: string | null) => {
    dispatch(setTaskAssignee({ taskId, newAssigneeId: memberId, dataField }));
    setIsOpen(false);
  };

  return (
    <VStack alignItems="flex-start" spacing={0} position="relative" ref={ref}>
      <UserAvatar
        {...props}
        onClick={onOpen}
        firstName={memberData?.firstName}
        lastName={memberData?.lastName}
        unassigned={!assigneeId}
      />

      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          marginTop={1}
          bg="white"
          boxShadow="md"
          right={0}
          zIndex={10}
          h="fit-content"
          borderRadius={8}
          borderWidth={1}
          p={2}
        >
          <AssigneeSelection
            onAssigneeChange={onAssigneeChange}
            tiny
            initialSelection={memberData}
          />
        </Box>
      )}
    </VStack>
  );
};

export default TinyAssigneeSelection;
