import { Flex, Text, VStack } from '@chakra-ui/react';
import { memo, useState } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { logoutUser } from '../../../redux/auth/authSlice';
import UserAvatar from '../../ui/UserAvatar';

export const ProfileMenu = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const { user } = useAppSelector((state) => state.auth);

  const handleProfileClick = (): void => {
    setOpen(!open);
  };

  const handleLogoutClick = (): void => {
    dispatch(logoutUser());
  };

  return (
    <Flex
      w={9}
      h={9}
      borderRadius="full"
      alignItems="center"
      justifyContent="center"
      onClick={handleProfileClick}
      position="relative"
      cursor="pointer"
    >
      <UserAvatar firstName={user?.firstName} lastName={user?.lastName} />

      {open && (
        <VStack
          position="absolute"
          top={12}
          right={0}
          backgroundColor="white"
          borderWidth={1}
          borderColor="gray.300"
          w="fit-content"
          minW="150px"
          borderRadius={8}
        >
          <Text>My Profile</Text>

          <Text>
            {user?.firstName} {user?.lastName}
          </Text>

          <Text>{user?.email}</Text>

          <Flex
            borderTopWidth={1}
            borderTopColor="gray.300"
            w="full"
            py={1}
            px={2}
            cursor="pointer"
            onClick={handleLogoutClick}
          >
            <Text>Logout</Text>
          </Flex>
        </VStack>
      )}
    </Flex>
  );
};

export default memo(ProfileMenu);
