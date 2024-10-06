import {
  Center,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { memo, useState } from 'react';
import SvgIcon from '../../../ui/SvgIcon';
import Invitations from './Invitations/Invitations';

export const Notifications = () => {
  const [open, setOpen] = useState(false);

  const handleProfileClick = (): void => {
    setOpen(!open);
  };

  return (
    <Flex
      w={9}
      h={9}
      borderRadius="full"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      <Center cursor="pointer" onClick={handleProfileClick}>
        <SvgIcon name="bell" fill="gray.500" width="22px" height="22px" />
      </Center>

      {open && (
        <VStack
          position="absolute"
          top={12}
          right={0}
          backgroundColor="white"
          borderWidth={1}
          borderColor="gray.300"
          w="fit-content"
          minW="450px"
          borderRadius={8}
          alignItems="flex-start"
          py={4}
        >
          <Tabs position="relative" isLazy w="full">
            <TabList>
              <Tab>Notifications</Tab>
              <Tab>Invites</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Text>You have no notifications.</Text>
              </TabPanel>
              <TabPanel>
                <Invitations />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      )}
    </Flex>
  );
};

export default memo(Notifications);
