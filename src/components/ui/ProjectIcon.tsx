import { Image } from '@chakra-ui/react';
import DEFAULT_AVATARS from '../../constants/defaultAvatars';
import { useMemo } from 'react';

interface ProjectIconProps {
  iconUrl: string | null;
  defaultIconId: number | null;
}

const ProjectIcon = ({ iconUrl, defaultIconId }: ProjectIconProps) => {
  const selectedDefaultIcon = useMemo(() => {
    if (iconUrl) {
      return null;
    }
    return (
      DEFAULT_AVATARS.find((avatar) => avatar.id === defaultIconId) ||
      DEFAULT_AVATARS[0]
    );
  }, [defaultIconId, iconUrl]);

  return (
    <Image
      src={iconUrl ? iconUrl : `${selectedDefaultIcon?.url}&size=100x100`}
      bg={selectedDefaultIcon?.bgColor}
      boxSize="28px"
      minW="28px"
      borderRadius={6}
    />
  );
};

export default ProjectIcon;
