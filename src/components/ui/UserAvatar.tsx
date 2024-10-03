import React from 'react';
import { Box, BoxProps, HStack, Text } from '@chakra-ui/react';
import SvgIcon from './SvgIcon';

interface UserAvatarProps {
  firstName?: string;
  lastName?: string;
  showFullName?: boolean;
  size?: BoxProps['width'];
  unassigned?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  firstName,
  lastName,
  showFullName,
  size = 7,
  unassigned,
}) => {
  const initials =
    `${(firstName || '')[0]}${(lastName || '')[0]}`.toUpperCase();

  return (
    <HStack>
      <Box
        bg={unassigned ? 'gray.600' : 'teal.500'}
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
