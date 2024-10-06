import { VStack } from '@chakra-ui/react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import InvitationItem from './InvitationItem';
import { selectInvitations } from '../../../../../redux/invitations/invitationsSelectors';
import { IProjectInvitation } from '../../../../../redux/invitations/invitationsTypes';

export const Invitations = () => {
  const invitations = useAppSelector(selectInvitations);

  const renderInvitationItem = (
    invitation: IProjectInvitation,
    index: number,
  ) => {
    return <InvitationItem key={index} invitation={invitation} />;
  };

  return <VStack w="full">{invitations.map(renderInvitationItem)}</VStack>;
};

export default Invitations;
