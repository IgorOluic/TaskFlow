import { HStack, Text, VStack } from '@chakra-ui/react';
import UserAvatar from '../UserAvatar';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectMemberById } from '../../../redux/members/membersSelectors';
import { IMember } from '../../../redux/members/membersTypes';

const withMemberData = (
  WrappedComponent: React.ComponentType<AssigneeSelectionItemProps>,
) => {
  const MemberDataWrapper = ({
    id,
    ...rest
  }: { id: string } & Omit<AssigneeSelectionItemProps, 'memberData'>) => {
    const memberData = useAppSelector(selectMemberById(id));
    return <WrappedComponent memberData={memberData} {...rest} />;
  };

  MemberDataWrapper.displayName = `withMemberData(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return MemberDataWrapper;
};

interface AssigneeSelectionItemProps {
  onClick: (item: IMember | null) => void;
  unassigned?: boolean;
  memberData?: IMember | null;
}

export const AssigneeSelectionItem = ({
  onClick,
  unassigned,
  memberData,
}: AssigneeSelectionItemProps) => {
  const handleClick = () => {
    onClick(memberData || null);
  };

  return (
    <HStack
      h={10}
      px={4}
      _hover={{ bg: 'gray.100' }}
      cursor="pointer"
      onClick={handleClick}
      w="full"
    >
      <UserAvatar
        unassigned={unassigned}
        size="28px"
        firstName={memberData?.firstName}
        lastName={memberData?.lastName}
      />
      <VStack spacing={1} alignItems="flex-start">
        <Text fontSize={14} lineHeight="14px">
          {unassigned
            ? 'Unassigned'
            : `${memberData?.firstName || ''} ${memberData?.lastName || ''}`}
        </Text>

        {!unassigned && (
          <Text fontSize={12} color="gray.500" lineHeight="12px">
            {memberData?.email || ''}
          </Text>
        )}
      </VStack>
    </HStack>
  );
};

export const AssigneeSelectionItemWithMemberData = withMemberData(
  AssigneeSelectionItem,
);

export default AssigneeSelectionItem;
