import { Box, VStack, useOutsideClick } from '@chakra-ui/react';
import { useRef } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import UserAvatar, { UserAvatarProps } from '../UserAvatar';
import AssigneeSelection from '.';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectMemberById } from '../../../redux/members/membersSelectors';
import { setTaskAssignee } from '../../../redux/tasks/tasksSlice';
import { TaskStatus } from '../../../redux/tasks/tasksTypes';
import useVisibilityControl from '../../../hooks/useVisibilityControl';

interface TinyAssigneeSelectionProps extends UserAvatarProps {
  taskId: string;
  assigneeId: string | null;
  status: TaskStatus;
}

const TinyAssigneeSelection = ({
  taskId,
  assigneeId,
  status,
  ...props
}: TinyAssigneeSelectionProps) => {
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useVisibilityControl();
  const memberData = useAppSelector(selectMemberById(assigneeId));
  const ref = useRef(null);

  useOutsideClick({ ref, handler: onClose });

  const onAssigneeChange = (memberId: string | null) => {
    dispatch(
      setTaskAssignee({ taskId, newAssigneeId: memberId, taskStatus: status }),
    );
    onClose();
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
