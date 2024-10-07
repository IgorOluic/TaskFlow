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
import { memo, useRef, useState } from 'react';
import SvgIcon from '../../../ui/SvgIcon';
import InvitationList from './InvitationList';
import NotificationList from './NotificationList';

export const Notifications = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleProfileClick = (): void => {
    setOpen(!open);
  };

  const onClose = () => {
    setOpen(false);
  };

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
      <Center cursor="pointer" onClick={handleProfileClick}>
        <SvgIcon name="bell" fill="gray.500" width="22px" height="22px" />
      </Center>

      {open && (
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
