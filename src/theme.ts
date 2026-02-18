import { createTheme } from '@mui/material/styles';

export const BLOOM = {
  blue: '#1B75BB',
  blueDark: '#155A93',
  blueLight: '#00ADEE',
  bluePale: '#e0f0fc',
  green: '#37A526',
  greenDark: '#2B8020',
  greenPale: '#e6f5e0',
  greenBorder: '#bbf7d0',
  lightGreen: '#8BC53F',
  orange: '#F6921E',
  orangePale: '#fef3d6',
  orangeBorder: '#f6c66a',
  yellow: '#E8DE23',
  yellowPale: '#fef9c3',
  yellowBorder: '#fcd34d',
  red: '#b91c1c',
  redDark: '#D02E2E',
  redPale: '#fee2e2',
  redBorder: '#fca5a5',
  canvas: '#F2F7F6',
  canvasDark: '#E5EFED',
  border: '#e0e5e4',
  white: '#ffffff',
  textPrimary: '#1a1a1a',
  textSecondary: '#808285',
  textTertiary: '#a8aaad',
  amber: '#946b0e',
  amberPale: '#fef9c3',
  amberBorder: '#fcd34d',
  review: '#7c5500',
  reviewPale: '#fef3d6',
};

export const theme = createTheme({
  palette: {
    primary: {
      main: BLOOM.blue,
      light: BLOOM.blueLight,
      dark: BLOOM.blueDark,
    },
    secondary: {
      main: BLOOM.lightGreen,
      dark: BLOOM.green,
    },
    success: {
      main: BLOOM.green,
      light: BLOOM.lightGreen,
    },
    warning: {
      main: BLOOM.orange,
    },
    error: {
      main: BLOOM.redDark,
    },
    info: {
      main: BLOOM.blueLight,
    },
    background: {
      default: BLOOM.canvas,
      paper: BLOOM.white,
    },
    text: {
      primary: BLOOM.textPrimary,
      secondary: BLOOM.textSecondary,
    },
    divider: BLOOM.border,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 6,
          fontSize: '0.8125rem',
        },
        sizeSmall: {
          padding: '4px 10px',
          fontSize: '0.75rem',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.75rem',
          minHeight: 40,
          padding: '8px 14px',
          '&.Mui-selected': { fontWeight: 600 },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 40 },
        indicator: { height: 2 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.6875rem',
          height: 22,
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${BLOOM.border}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${BLOOM.border}`,
          borderRadius: 0,
        },
      },
    },
  },
});
