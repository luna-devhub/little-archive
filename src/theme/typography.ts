import { TextStyle } from 'react-native';
import { colors } from './colors';

export const fonts = {
  heading: 'PlayfairDisplay-Regular',
  headingBold: 'PlayfairDisplay-Bold',
  body: 'Lora-Regular',
  bodyBold: 'Lora-Bold',
  bodyItalic: 'Lora-Italic',
  label: 'Lora-Regular',
} as const;

export const typography: Record<string, TextStyle> = {
  h1: {
    fontFamily: fonts.headingBold,
    fontSize: 32,
    lineHeight: 40,
    color: colors.ink,
  },
  h2: {
    fontFamily: fonts.heading,
    fontSize: 24,
    lineHeight: 32,
    color: colors.ink,
  },
  h3: {
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 28,
    color: colors.ink,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  },
  bodySmall: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.fadedInk,
  },
  label: {
    fontFamily: fonts.label,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.fadedInk,
  },
  button: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.cream,
  },
};
