import { Flex, HStack, Text } from '@chakra-ui/react';
import { memo } from 'react';
import SvgIcon from '../ui/SvgIcon';
import SVGS from '../../constants/SVGS';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

type SideBarItemProps = {
  name: string;
  iconName: keyof typeof SVGS;
  path: string;
};

export const SideBarItem = ({ name, iconName, path }: SideBarItemProps) => {
  const location = useLocation();
  const { projectKey } = useParams();
  const navigate = useNavigate();

  const isSelected = location.pathname === path;

  const handleClick = () => {
    navigate(`/projects/${projectKey}${path}`);
  };

  return (
    <HStack
      w="full"
      px={1.5}
      py={0.5}
      borderRadius={4}
      _hover={{
        backgroundColor: !isSelected && 'purple.50',
      }}
      cursor="pointer"
      role="group"
      spacing={0}
      onClick={handleClick}
      width="full"
      backgroundColor={isSelected ? 'purple.50' : 'transparent'}
    >
      <Flex w="36px" h="36px" alignItems="center" justifyContent="center">
        <SvgIcon
          name={iconName}
          width="18px"
          height="18px"
          color={isSelected ? 'purple.600' : 'gray.600'}
        />
      </Flex>

      <Text
        ml="8px"
        fontWeight={500}
        fontSize={14}
        color={isSelected ? 'purple.600' : 'gray.600'}
      >
        {name}
      </Text>
    </HStack>
  );
};

export default memo(SideBarItem);
