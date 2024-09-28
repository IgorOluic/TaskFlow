import { Link as ReactRouterLink } from 'react-router-dom';
import { Link as ChakraLink, forwardRef } from '@chakra-ui/react';

const CustomLink = forwardRef((props, ref) => {
  return <ChakraLink as={ReactRouterLink} ref={ref} {...props} />;
});

export default CustomLink;
