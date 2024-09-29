import { Center, Image } from '@chakra-ui/react';
import { DefaultAvatarIcon } from '../../../constants/defaultAvatars';

interface AvatarGridProps {
  avatar: DefaultAvatarIcon;
  focusedIcon: DefaultAvatarIcon | null;
  onClick: (icon: DefaultAvatarIcon) => void;
}

const DefaultIconItem = ({ avatar, focusedIcon, onClick }: AvatarGridProps) => {
  return (
    <Center
      onClick={() => onClick(avatar)}
      cursor="pointer"
      borderWidth={2}
      borderColor={
        focusedIcon?.url === avatar.url ? 'purple.600' : 'transparent'
      }
      borderRadius={6}
      w="46px"
      h="46px"
    >
      <Image
        src={`${avatar.url}&size=100x100`}
        bg={avatar.bgColor}
        boxSize="40px"
        minW="40px"
        borderRadius={6}
      />
    </Center>
  );
};

export default DefaultIconItem;
