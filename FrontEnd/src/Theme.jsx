import { createTheme } from '@mui/material/styles';

const customColors = {
  greenA100: '#B9F6CA',
  greenA200: '#69F0AE',
  greenA400: '#00E676',
  greenA700: '#00C853',
  grey: '#555',
};

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: customColors.greenA700, // Use the A700 shade for the main color
      contrastText: '#fff',
    },
    background: {
      default: '#fff',
      paper: '#f3f3f3',
    },
    text: {
      primary: '#333',
      secondary: 'rgba(0, 0, 0, 0.7)',
    },
    action: {
      active: customColors.greenA700,
      hover: `${customColors.greenA700}08`, // hex value with alpha
      selected: `${customColors.greenA700}16`, // hex value with alpha
    },
    divider: '#ddd',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: customColors.greenA700,
      contrastText: '#fff',
    },
    background: {
      default: '#000',
      paper: '#111',
    },
    text: {
      primary: '#fff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    action: {
      active: customColors.greenA700,
      hover: `${customColors.greenA700}08`, // hex value with alpha
      selected: `${customColors.greenA700}16`, // hex value with alpha

    },
    divider: customColors.grey,
  },
});

export { lightTheme, darkTheme };
