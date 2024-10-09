import React from 'react';
import { Box, BoxProps, HStack, Text } from '@chakra-ui/react';
import SvgIcon from './SvgIcon';

export interface UserAvatarProps {
  firstName?: string;
  lastName?: string;
  showFullName?: boolean;
  size?: BoxProps['width'];
  unassigned?: boolean;
  onClick?: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  firstName,
  lastName,
  showFullName,
  size = 7,
  unassigned,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  const initials =
    `${(firstName || '')[0]}${(lastName || '')[0]}`.toUpperCase();

  return (
    <HStack onClick={handleClick} cursor={onClick && 'pointer'}>
      <Box
        bg={unassigned ? 'gray.500' : 'teal.500'}
        color="white"
        borderRadius="full"
        width={size}
        height={size}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontWeight="bold"
        fontSize="lg"
      >
        {unassigned ? (
          <SvgIcon
            name="unassignedUser"
            width="22px"
            height="22px"
            mt={1}
            fill="white"
          />
        ) : (
          <Text fontSize={10} fontWeight={500}>
            {initials}
          </Text>
        )}
      </Box>

      {showFullName && firstName && lastName && (
        <Text fontSize={14}>
          {firstName} {lastName}
        </Text>
      )}
    </HStack>
  );
};

export default UserAvatar;
