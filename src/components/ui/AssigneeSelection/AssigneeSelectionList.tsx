import { VStack } from '@chakra-ui/react';
import AssigneeSelectionItem, {
  AssigneeSelectionItemWithMemberData,
} from './AssigneeSelectionItem';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectFilteredMemberIds } from '../../../redux/members/membersSelectors';
import { IMember } from '../../../redux/members/membersTypes';

interface AssigneeSelectionProps {
  onItemClick: (item: IMember | null) => void;
  tiny?: boolean;
}

const AssigneeSelectionList = ({
  onItemClick,
  tiny,
}: AssigneeSelectionProps) => {
  const memberIds = useAppSelector(selectFilteredMemberIds);

  const renderAssigneeItem = (id: string, index: number) => {
    return (
      <AssigneeSelectionItemWithMemberData
        key={index}
        onClick={onItemClick}
        id={id}
      />
    );
  };

  return (
    <VStack
      position={tiny ? 'relative' : 'absolute'}
      borderWidth={tiny ? 0 : 1}
      boxShadow={tiny ? 'none' : 'md'}
      w="350px"
      bg="white"
      top="100%"
      mt={2}
      borderRadius={8}
      py={2}
      spacing={0}
    >
      <AssigneeSelectionItem onClick={onItemClick} unassigned />
      {memberIds.map(renderAssigneeItem)}
    </VStack>
  );
};

export default AssigneeSelectionList;
