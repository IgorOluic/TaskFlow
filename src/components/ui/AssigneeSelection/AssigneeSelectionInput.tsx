import {
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setAssigneeSearch } from '../../../redux/members/membersSlice';

interface AssigneeSelectionInputProps {
  inputLeftElement?: JSX.Element;
  onFocus?: InputProps['onFocus'];
  isOpen?: boolean;
  selectedValue?: string;
}

const AssigneeSelectionInput = ({
  inputLeftElement,
  onFocus,
  isOpen,
  selectedValue,
}: AssigneeSelectionInputProps) => {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setAssigneeSearch(search));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  return (
    <InputGroup>
      {inputLeftElement && (
        <InputLeftElement>{inputLeftElement}</InputLeftElement>
      )}
      <Input
        value={isOpen ? search : selectedValue}
        onChange={handleInputChange}
        w="350px"
        onFocus={onFocus}
        contentEditable={isOpen}
        cursor={!isOpen ? 'pointer' : 'text'}
        fontSize={14}
      />
    </InputGroup>
  );
};

export default AssigneeSelectionInput;
