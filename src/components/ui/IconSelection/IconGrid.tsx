import { Grid, GridItem } from '@chakra-ui/react';
import { DefaultAvatarIcon } from '../../../constants/defaultAvatars';
import DefaultIconItem from './DefaultAvatarIcon';

interface AvatarGridProps {
  avatars: DefaultAvatarIcon[];
  focusedIcon: DefaultAvatarIcon | null;
  onClick: (icon: DefaultAvatarIcon) => void;
}

const IconGrid = ({ avatars, focusedIcon, onClick }: AvatarGridProps) => {
  return (
    <Grid templateColumns="repeat(5, 1fr)" gap={4} w="full">
      {avatars.map((avatar, index) => (
        <GridItem key={index}>
          <DefaultIconItem
            avatar={avatar}
            focusedIcon={focusedIcon}
            onClick={onClick}
          />
        </GridItem>
      ))}
    </Grid>
  );
};

export default IconGrid;
