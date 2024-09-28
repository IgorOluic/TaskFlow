import React from 'react';
import { Box, HStack, Text } from '@chakra-ui/react'; // Assuming you're using Chakra UI for styling

interface UserAvatarProps {
  firstName?: string;
  lastName?: string;
  showFullName?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  firstName,
  lastName,
  showFullName,
}) => {
  const initials =
    `${(firstName || '')[0]}${(lastName || '')[0]}`.toUpperCase();

  return (
    <HStack>
      <Box
        bg="teal.500"
        color="white"
        borderRadius="full"
        width={7}
        height={7}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontWeight="bold"
        fontSize="lg"
      >
        <Text fontSize={10} fontWeight={500}>
          {initials}
        </Text>
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
