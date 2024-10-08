import {
  Center,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  useOutsideClick,
} from '@chakra-ui/react';
import { memo, useRef } from 'react';
import SvgIcon from '../../../ui/SvgIcon';
import InvitationList from './InvitationList';
import NotificationList from './NotificationList';
import useVisibilityControl from '../../../../hooks/useVisibilityControl';

export const Notifications = () => {
  const { isOpen, onToggle, onClose } = useVisibilityControl();
  const ref = useRef(null);

  useOutsideClick({ ref, handler: onClose });

  return (
    <Flex
      w={9}
      h={9}
      borderRadius="full"
      alignItems="center"
      justifyContent="center"
      position="relative"
      ref={ref}
    >
      <Center cursor="pointer" onClick={onToggle}>
        <SvgIcon name="bell" fill="gray.500" width="22px" height="22px" />
      </Center>

      {isOpen && (
        <VStack
          position="absolute"
          top="100%"
          mt={1}
          right={0}
          backgroundColor="white"
          borderWidth={1}
          borderColor="gray.300"
          w="450px"
          maxW="450px"
          minH="450px"
          borderRadius={8}
          alignItems="flex-start"
          py={4}
          boxShadow="md"
        >
          <Tabs position="relative" isLazy w="full">
            <TabList>
              <Tab>Notifications</Tab>
              <Tab>Invitations</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <NotificationList />
              </TabPanel>
              <TabPanel>
                <InvitationList />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      )}
    </Flex>
  );
};

export default memo(Notifications);
