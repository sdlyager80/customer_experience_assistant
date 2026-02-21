import { createTheme } from '@mui/material/styles';

// ── Bloom Insurance brand tokens — sourced from Visual Style Guide 2023 ───────
//
// Primary palette:  Orange #F6921E · Yellow #E8DE23 · Light Green #8BC53F
//                   Green #37A526 · Light Blue #00ADEE · Blue #1B75BB
// Secondary:        Red #D02E2E · Pale Aqua #F2F7F6
// Neutral:          Grey #808285 · Black #000000
// Fonts:            Roboto Slab (headings) · Roboto (body)
//
// Usage hierarchy:
//   Blue       → primary interactive (links, CTAs, selected state)
//   Green      → success, completion, positive outcomes
//   Orange     → single-use accent, warm emphasis (use sparingly)
//   Red        → urgency, errors, critical alerts only
//   Pale Aqua  → page/canvas background surface
//   Grey       → secondary text, muted borders, inactive states

export const BLOOM = {
  // ── Core brand colours ───────────────────────────────────────────────────
  blue:        '#1B75BB',
  blueLight:   '#00ADEE',
  bluePale:    '#E8F3FB',   // tint for selected / highlight backgrounds

  green:       '#37A526',
  lightGreen:  '#8BC53F',
  greenPale:   '#EAF5E6',   // tint for success banners

  orange:      '#F6921E',
  orangePale:  '#FEF3E7',   // tint for warm accent areas

  yellow:      '#E8DE23',   // use only for data-viz / score bars

  red:         '#D02E2E',
  redPale:     '#FCEAEA',   // tint for urgent / error areas

  // ── Neutral ───────────────────────────────────────────────────────────────
  grey:        '#808285',

  // ── Surfaces ─────────────────────────────────────────────────────────────
  canvas:      '#F2F7F6',   // Pale Aqua — page background
  white:       '#FFFFFF',
  border:      '#DDE4E2',   // subtle border derived from Pale Aqua

  // ── Text ─────────────────────────────────────────────────────────────────
  textPrimary:   '#1A1A1A',
  textSecondary: '#808285', // Grey from style guide
};

// ── MUI theme ─────────────────────────────────────────────────────────────────

export const theme = createTheme({
  palette: {
    primary: {
      main:  BLOOM.blue,
      light: BLOOM.blueLight,
    },
    secondary: {
      main: BLOOM.lightGreen,
      dark: BLOOM.green,
    },
    success: {
      main:  BLOOM.green,
      light: BLOOM.lightGreen,
    },
    warning: {
      main: BLOOM.orange,
    },
    error: {
      main: BLOOM.red,
    },
    info: {
      main: BLOOM.blueLight,
    },
    background: {
      default: BLOOM.canvas,
      paper:   BLOOM.white,
    },
    text: {
      primary:   BLOOM.textPrimary,
      secondary: BLOOM.textSecondary,
    },
    divider: BLOOM.border,
  },

  typography: {
    // Roboto for all UI text — clean, readable at small sizes
    fontFamily: '"Roboto", "Helvetica Neue", "Arial", sans-serif',

    // Roboto Slab for headings — gives the brand identity
    h1: { fontFamily: '"Roboto Slab", serif', fontWeight: 700 },
    h2: { fontFamily: '"Roboto Slab", serif', fontWeight: 700 },
    h3: { fontFamily: '"Roboto Slab", serif', fontWeight: 600 },
    h4: { fontFamily: '"Roboto Slab", serif', fontWeight: 600 },
    h5: { fontFamily: '"Roboto Slab", serif', fontWeight: 500 },
    h6: { fontFamily: '"Roboto Slab", serif', fontWeight: 500 },
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
          fontFamily: '"Roboto", sans-serif',
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
        root:      { minHeight: 40 },
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
