import { Flex, Text, VStack, useOutsideClick } from '@chakra-ui/react';
import { memo, useRef } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { logoutUser } from '../../../redux/auth/authSlice';
import UserAvatar from '../../ui/UserAvatar';
import useVisibilityControl from '../../../hooks/useVisibilityControl';

export const ProfileMenu = () => {
  const dispatch = useAppDispatch();
  const { isOpen, onClose, onToggle } = useVisibilityControl();
  const ref = useRef(null);

  useOutsideClick({ ref, handler: onClose });

  const { user } = useAppSelector((state) => state.auth);

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
      onClick={onToggle}
      position="relative"
      cursor="pointer"
      ref={ref}
    >
      <UserAvatar firstName={user?.firstName} lastName={user?.lastName} />

      {isOpen && (
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
