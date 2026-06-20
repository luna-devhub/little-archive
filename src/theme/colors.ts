export const colors = {
  // Primary backgrounds
  parchment: '#F5F0E8',
  cream: '#FFFDF7',

  // Accent colors
  amber: '#C4956A',
  leather: '#8B5E3C',

  // Text colors
  ink: '#2C1810',
  fadedInk: '#6B5B4B',

  // Borders and dividers
  agedPaper: '#E8DFD0',

  // Destructive actions
  waxSeal: '#A0522D',

  // Additional utility colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
