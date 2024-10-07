import { Text, VStack } from '@chakra-ui/react';
import SvgIcon from '../../../../ui/SvgIcon';

export const NotificationList = () => {
  return (
    <VStack w="full">
      <VStack w="full" h="full">
        <SvgIcon name="emptyStateBox" w="250px" h="200px" />
        <Text fontSize={18} fontWeight={700}>
          You have no notifications.
        </Text>
      </VStack>
    </VStack>
  );
};

export default NotificationList;
