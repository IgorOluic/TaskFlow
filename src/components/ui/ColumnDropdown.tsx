import React, { useMemo, useState } from 'react';
import { FormLabel, HStack, Text, VStack } from '@chakra-ui/react';
import SvgIcon from './SvgIcon';
import { selectColumnsArray } from '../../redux/columns/columnsSelectors';
import { useAppSelector } from '../../hooks/useAppSelector';
import { IColumn } from '../../redux/columns/columnsTypes';

interface ColumnSelectProps {
  onChange: (id: string) => void;
}

const ColumnDropdown = ({ onChange }: ColumnSelectProps) => {
  const columns = useAppSelector(selectColumnsArray);

  const [selectedColumn, setSelectedColumn] = useState(columns[0]);

  const filteredColumns = useMemo(() => {
    return columns.filter((column) => column.id !== selectedColumn.id);
  }, [columns, selectedColumn]);

  const [open, setOpen] = useState(false);

  const onClick = () => {
    setOpen(!open);
  };

  const renderSelectionItem = (column: IColumn, index: number) => {
    const onColumnClick = () => {
      setSelectedColumn(column);
      onChange(column.id);
      setOpen(false);
    };

    return (
      <HStack
        key={index}
        w="full"
        py={1.5}
        _hover={{ backgroundColor: 'gray.100' }}
        cursor="pointer"
        px={4}
        onClick={onColumnClick}
      >
        <Text fontSize={14} fontWeight={500}>
          {column.name}
        </Text>
      </HStack>
    );
  };

  return (
    <VStack
      position="relative"
      className="no-select"
      w="fit-content"
      alignItems="flex-start"
      spacing={0}
    >
      <FormLabel>Status</FormLabel>
      <HStack
        px={4}
        py={1.5}
        bg="purple.600"
        alignItems="center"
        w="fit-content"
        borderRadius={5}
        cursor="pointer"
        onClick={onClick}
      >
        <Text
          color="white"
          fontSize={14}
          fontWeight={500}
          textTransform="uppercase"
        >
          {selectedColumn?.name}
        </Text>

        <SvgIcon name="chevronDown" height="12px" width="12px" fill="white" />
      </HStack>

      {open && (
        <VStack
          position="absolute"
          bg="white"
          boxShadow="md"
          left={0}
          zIndex={10}
          py={2}
          minW="250px"
          alignItems="flex-start"
          borderWidth={1}
          borderRadius={5}
          spacing={0}
          top="100%"
          marginTop="10px"
        >
          {filteredColumns.map(renderSelectionItem)}
        </VStack>
      )}
    </VStack>
  );
};

export default ColumnDropdown;
