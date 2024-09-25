import { chakra, ChakraProps } from '@chakra-ui/react';
import SVGS from '../../constants/SVGS';

interface SvgIconProps extends ChakraProps {
  name: keyof typeof SVGS;
}

const SvgIcon = ({ name, ...props }: SvgIconProps) => {
  const Icon = SVGS[name] || SVGS['calendar'];

  return (
    <chakra.svg
      preserveAspectRatio="xMinYMin meet"
      height={24}
      width={24}
      as={Icon?.type}
      xmlns="http://www.w3.org/2000/svg"
      {...Icon.props}
      {...props}
      className="no-select"
    />
  );
};

export default SvgIcon;
