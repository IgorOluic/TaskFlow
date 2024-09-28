import { Text, VStack } from '@chakra-ui/react';

const HomePage = () => {
  return (
    <VStack
      w="full"
      alignItems="flex-start"
      px={5}
      pt={5}
      justifyContent="center"
    >
      <Text>
        You are not a part of any projects at the moment, please create one
      </Text>
    </VStack>
  );
};

export default HomePage;
