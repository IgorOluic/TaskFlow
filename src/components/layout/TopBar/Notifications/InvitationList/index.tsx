import { Text, VStack } from '@chakra-ui/react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import InvitationItem from './InvitationItem';
import { selectInvitations } from '../../../../../redux/invitations/invitationsSelectors';
import { IProjectInvitation } from '../../../../../redux/invitations/invitationsTypes';
import SvgIcon from '../../../../ui/SvgIcon';

export const InvitationList = () => {
  const invitations = useAppSelector(selectInvitations);

  const renderInvitationItem = (
    invitation: IProjectInvitation,
    index: number,
  ) => {
    return <InvitationItem key={index} invitation={invitation} />;
  };

  return (
    <VStack w="full" alignItems="flex-start">
      {invitations.length === 0 ? (
        <VStack w="full" h="full">
          <SvgIcon name="emptyStateBox" w="250px" />
          <Text fontSize={18} fontWeight={700}>
            You have no invitations.
          </Text>
        </VStack>
      ) : (
        invitations.map(renderInvitationItem)
      )}
    </VStack>
  );
};

export default InvitationList;
