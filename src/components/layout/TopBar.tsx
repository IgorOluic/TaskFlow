import { HStack, Text } from '@chakra-ui/react';
import { memo } from 'react';

type TopBarProps = {};

export const TopBar = ({}: TopBarProps) => {
  return (
    <HStack
      w="full"
      h="56px"
      borderBottomWidth={1}
      borderBottomColor="gray.100"
      position="fixed"
      top={0}
      px={4}
      backgroundColor="white"
      zIndex={10}
    >
      <HStack
        width="100%"
        spacing={3}
        role="group"
        cursor="pointer"
        justifyContent="flex-start"
      >
        <Text color="gray.900" fontSize={20} fontWeight={500}>
          TaskFlow
        </Text>
      </HStack>
    </HStack>
  );
};

export default memo(TopBar);
