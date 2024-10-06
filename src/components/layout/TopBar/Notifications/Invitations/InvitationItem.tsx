import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import { IProjectInvitation } from '../../../../../redux/invitations/invitationsTypes';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import {
  acceptInvitation,
  denyInvitation,
} from '../../../../../redux/invitations/invitationsSlice';

interface InvitationItemProps {
  invitation: IProjectInvitation;
}

export const InvitationItem = ({ invitation }: InvitationItemProps) => {
  const dispatch = useAppDispatch();

  const handleAccept = () => {
    dispatch(
      acceptInvitation({
        invitationId: invitation.id,
        projectId: invitation.projectId,
      }),
    );
  };

  const handleDeny = () => {
    dispatch(
      denyInvitation({
        invitationId: invitation.id,
      }),
    );
  };

  return (
    <VStack alignItems="flex-start" w="full">
      <Text fontSize={14}>
        {invitation.inviter.firstName} {invitation.inviter.lastName} invited you
        to join {invitation.project.name}
      </Text>

      <HStack ml="auto">
        <Button size="sm" onClick={handleAccept}>
          Accept
        </Button>
        <Button size="sm" onClick={handleDeny}>
          Deny
        </Button>
      </HStack>
    </VStack>
  );
};

export default InvitationItem;
