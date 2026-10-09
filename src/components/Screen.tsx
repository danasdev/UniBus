import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradients, spacing, TAB_BAR_HEIGHT } from '@/theme';
import { Text } from './ui';

export function Background({ children }: { children?: ReactNode }) {
  return (
    <View style={styles.fill}>
      <LinearGradient colors={gradients.background} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
}

/**
 * Standard scrolling page with an iOS-style large title.
 * `tab` adds bottom room for the floating tab bar.
 */
export function Screen({
  title,
  subtitle,
  right,
  children,
  tab,
  modal,
  scroll = true,
  contentStyle,
}: {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  tab?: boolean;
  /** iOS sheet: the system already offsets content below the status bar. */
  modal?: boolean;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  const bottom = (tab ? TAB_BAR_HEIGHT + spacing.lg : 0) + insets.bottom + spacing.xl;

  const header = title ? (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        {subtitle ? (
          <Text variant="subhead" tone="secondary" style={{ marginBottom: 2 }}>
            {subtitle}
          </Text>
        ) : null}
        <Text variant="largeTitle">{title}</Text>
      </View>
      {right}
    </View>
  ) : null;

  const top = modal && Platform.OS === 'ios' ? spacing.xl : insets.top + spacing.md;
  const padding = { paddingTop: top, paddingBottom: bottom };

  return (
    <Background>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, padding, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {header}
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fill, styles.content, padding, contentStyle]}>
          {header}
          {children}
        </View>
      )}
    </Background>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.bgTop },
  content: { paddingHorizontal: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
});
