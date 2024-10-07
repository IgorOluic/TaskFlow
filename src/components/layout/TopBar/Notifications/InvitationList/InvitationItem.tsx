import { Center, HStack, Text, VStack } from '@chakra-ui/react';
import { IProjectInvitation } from '../../../../../redux/invitations/invitationsTypes';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import {
  acceptInvitation,
  denyInvitation,
} from '../../../../../redux/invitations/invitationsSlice';
import ProjectIcon from '../../../../ui/ProjectIcon';
import SvgIcon from '../../../../ui/SvgIcon';

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
    <HStack w="full" alignItems="center" borderBottomWidth={1} py={4}>
      <ProjectIcon
        iconUrl={invitation.project.iconUrl}
        defaultIconId={invitation.project.defaultIconId}
        boxSize={10}
      />

      <VStack alignItems="flex-start" spacing={0} flex={1}>
        <Text fontSize={14}>You were invited you to join</Text>

        <Text fontWeight={500} noOfLines={1} maxW="270px" fontSize={14}>
          {invitation.project.name}
        </Text>
      </VStack>

      <HStack justifyContent="flex-end">
        <Center
          w="30px"
          h="30px"
          borderRadius="full"
          bg="gray.200"
          onClick={handleDeny}
          cursor="pointer"
          _hover={{ bg: 'gray.300' }}
        >
          <SvgIcon name="close" width="14px" height="14px" />
        </Center>

        <Center
          w="30px"
          h="30px"
          borderRadius="full"
          bg="yellow.400"
          _hover={{ bg: 'yellow.300' }}
          onClick={handleAccept}
          cursor="pointer"
        >
          <SvgIcon name="check" width="14px" height="14px" />
        </Center>
      </HStack>
    </HStack>
  );
};

export default InvitationItem;
