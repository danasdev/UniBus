import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, TAB_BAR_HEIGHT } from '@/theme';
import { haptic } from './haptics';
import { IconName, Text } from './ui';

const icons: Record<string, [IconName, IconName]> = {
  index: ['home-outline', 'home'],
  map: ['map-outline', 'map'],
  ticket: ['qr-code-outline', 'qr-code'],
  wallet: ['wallet-outline', 'wallet'],
  settings: ['person-circle-outline', 'person-circle'],
};

/** Floating, translucent tab bar. */
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom, spacing.md) }]} pointerEvents="box-none">
      <View style={styles.bar}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={40} tint="systemChromeMaterialDark" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.fallbackBg]} />
        )}

        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const label = descriptors[route.key].options.title ?? route.name;
          const [outline, filled] = icons[route.name] ?? ['ellipse-outline', 'ellipse'];
          const isTicket = route.name === 'ticket';

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) {
              haptic.select();
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.item}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
            >
              {isTicket ? (
                <View style={[styles.ticket, focused && styles.ticketActive]}>
                  <Ionicons name={filled} size={22} color={focused ? colors.onMint : colors.text} />
                </View>
              ) : (
                <>
                  <Ionicons name={focused ? filled : outline} size={23} color={focused ? colors.mint : colors.textSecondary} />
                  <Text variant="caption" style={[styles.label, { color: focused ? colors.mint : colors.textSecondary }]}>
                    {label}
                  </Text>
                </>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: spacing.lg, right: spacing.lg },
  bar: {
    height: TAB_BAR_HEIGHT,
    borderRadius: radius.xl,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.14)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  fallbackBg: {
    backgroundColor: 'rgba(8,24,21,0.92)',
    // web-only: frosted glass
    backdropFilter: 'blur(24px) saturate(160%)',
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, height: '100%' },
  label: { fontSize: 10.5 },
  ticket: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  ticketActive: { backgroundColor: colors.mint, borderColor: colors.mintLight },
});
