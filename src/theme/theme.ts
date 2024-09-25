import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { buttonTheme } from './button';
import '@fontsource/inter';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Extend the theme to include custom colors, fonts, etc.
const theme = extendTheme({
  config,
  fonts: {
    body: 'Inter, sans-serif',
    heading: 'Inter, sans-serif',
    inter: 'Inter, sans-serif',
  },
  components: {
    Button: buttonTheme,
  },
});

export default theme;
