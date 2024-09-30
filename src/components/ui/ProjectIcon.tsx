import { Image, ImageProps } from '@chakra-ui/react';
import DEFAULT_AVATARS from '../../constants/defaultAvatars';
import { useMemo } from 'react';

interface ProjectIconProps {
  iconUrl: string | null;
  defaultIconId: number | null;
  boxSize?: ImageProps['boxSize'];
}

const ProjectIcon = ({
  iconUrl,
  defaultIconId,
  boxSize = '28px',
}: ProjectIconProps) => {
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
      boxSize={boxSize}
      minW={boxSize}
      borderRadius={6}
    />
  );
};

export default ProjectIcon;
