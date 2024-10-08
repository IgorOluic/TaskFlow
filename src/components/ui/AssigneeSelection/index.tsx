import { FormLabel, VStack, useOutsideClick } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import AssigneeSelectionInput from './AssigneeSelectionInput';
import AssigneeSelectionList from './AssigneeSelectionList';
import { IMember } from '../../../redux/members/membersTypes';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setAssigneeSearch } from '../../../redux/members/membersSlice';
import UserAvatar from '../UserAvatar';

interface AssigneeSelectionProps {
  withLabel?: boolean;
  onAssigneeChange: (value: string | null) => void;
}

const AssigneeSelection = ({
  withLabel,
  onAssigneeChange,
}: AssigneeSelectionProps) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    dispatch(setAssigneeSearch(''));
    setIsOpen(false);
  };

  const ref = useRef(null);

  useOutsideClick({ ref, handler: onClose });

  const [selectedItem, setSelectedItem] = useState<IMember | null>(null);

  const handleItemClick = (item: IMember | null) => {
    onAssigneeChange(item ? item.userId : null);
    setSelectedItem(item);
    onClose();
  };

  return (
    <VStack alignItems="flex-start" spacing={0} position="relative" ref={ref}>
      {withLabel && <FormLabel>Assignee</FormLabel>}

      <AssigneeSelectionInput
        inputLeftElement={
          <UserAvatar
            unassigned={!selectedItem}
            firstName={selectedItem?.firstName}
            lastName={selectedItem?.lastName}
          />
        }
        onFocus={onOpen}
        isOpen={isOpen}
        selectedValue={
          selectedItem
            ? `${selectedItem.firstName} ${selectedItem.lastName}`
            : 'Unassigned'
        }
      />

      {isOpen && <AssigneeSelectionList onItemClick={handleItemClick} />}
    </VStack>
  );
};

export default AssigneeSelection;
