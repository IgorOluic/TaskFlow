import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { buttonTheme } from './button';
import '@fontsource/inter';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    body: 'Inter, sans-serif',
    heading: 'Inter, sans-serif',
    inter: 'Inter, sans-serif',
  },
  components: {
    Button: buttonTheme,
    FormLabel: {
      baseStyle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'gray.600',
        mb: 1,
      },
    },
  },
});

export default theme;
