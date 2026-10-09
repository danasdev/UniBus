import { Platform, TextStyle } from 'react-native';

/**
 * UniBus palette — derived from the original prototype:
 * near-black → deep teal background, brand blue, mint/aqua accent, gold for Premium.
 */
export const colors = {
  // Background gradient (top → bottom)
  bgTop: '#010403',
  bgMid: '#021A15',
  bgBottom: '#053F35',

  // Brand
  blue: '#0B4F86',
  blueDeep: '#083A63',
  mint: '#2DD4A4',
  mintLight: '#86F0C8',
  teal: '#0E9C8C',
  gold: '#F2B705',
  goldDeep: '#B98400',

  // Surfaces (layered translucency, Apple-style)
  surface: 'rgba(255,255,255,0.06)',
  surfaceRaised: 'rgba(255,255,255,0.09)',
  surfacePressed: 'rgba(255,255,255,0.13)',
  hairline: 'rgba(255,255,255,0.09)',
  solidSurface: '#0B1A17',

  // Text
  text: '#F4F8F6',
  textSecondary: 'rgba(225,240,234,0.62)',
  textTertiary: 'rgba(225,240,234,0.38)',
  onMint: '#03231C',

  danger: '#FF6B6B',
};

export const gradients = {
  background: [colors.bgTop, colors.bgMid, colors.bgBottom] as const,
  brand: [colors.blue, colors.teal] as const,
  card: ['#0D5A93', '#0B7F85', '#13B092'] as const,
  mint: [colors.mintLight, colors.mint] as const,
  premium: ['#151208', '#5E4500', colors.gold] as const,
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 };
export const radius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 };

type Weight = 'regular' | 'medium' | 'semibold' | 'bold';

/**
 * iOS uses SF Pro (system). Android/web use Inter, which needs one family per weight.
 */
export function font(weight: Weight): TextStyle {
  if (Platform.OS === 'ios') {
    const map = { regular: '400', medium: '500', semibold: '600', bold: '700' } as const;
    return { fontWeight: map[weight] };
  }
  const map = {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  } as const;
  return { fontFamily: map[weight] };
}

/** Apple HIG-like type scale. */
export const type = {
  largeTitle: { fontSize: 34, lineHeight: 41, letterSpacing: 0.2, ...font('bold') },
  title1: { fontSize: 28, lineHeight: 34, letterSpacing: 0.2, ...font('bold') },
  title2: { fontSize: 22, lineHeight: 28, letterSpacing: 0.1, ...font('bold') },
  title3: { fontSize: 20, lineHeight: 25, ...font('semibold') },
  headline: { fontSize: 17, lineHeight: 22, ...font('semibold') },
  body: { fontSize: 17, lineHeight: 22, ...font('regular') },
  callout: { fontSize: 16, lineHeight: 21, ...font('regular') },
  subhead: { fontSize: 15, lineHeight: 20, ...font('regular') },
  footnote: { fontSize: 13, lineHeight: 18, ...font('regular') },
  caption: { fontSize: 12, lineHeight: 16, ...font('medium') },
} satisfies Record<string, TextStyle>;

/** Height reserved at the bottom of tab screens for the floating tab bar. */
export const TAB_BAR_HEIGHT = 64;
