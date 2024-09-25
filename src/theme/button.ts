import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const solid = defineStyle({
  color: 'white',
  backgroundColor: 'purple.600',
  fontFamily: `Inter, sans-serif`,
  fontSize: 14,
  fontWeight: 500,
  _hover: {
    backgroundColor: 'purple.500',
  },
  _disabled: {
    _hover: {
      bg: 'purple.300 !important',
    },
  },
});

export const buttonTheme = defineStyleConfig({
  variants: { solid },
});
