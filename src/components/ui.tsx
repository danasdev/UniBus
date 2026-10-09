import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { ComponentProps, ReactNode, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text as RNText,
  TextInput,
  TextInputProps,
  TextProps,
  View,
  ViewStyle,
} from 'react-native';
import { colors, font, gradients, radius, spacing, type } from '@/theme';
import { haptic } from './haptics';

export type IconName = ComponentProps<typeof Ionicons>['name'];

/* ───────────────────────── Text ───────────────────────── */

type Variant = keyof typeof type;
type Tone = 'primary' | 'secondary' | 'tertiary' | 'mint' | 'onMint' | 'gold';

const toneColor: Record<Tone, string> = {
  primary: colors.text,
  secondary: colors.textSecondary,
  tertiary: colors.textTertiary,
  mint: colors.mint,
  onMint: colors.onMint,
  gold: colors.gold,
};

export function Text({
  variant = 'body',
  tone = 'primary',
  style,
  ...rest
}: TextProps & { variant?: Variant; tone?: Tone }) {
  return <RNText {...rest} style={[type[variant], { color: toneColor[tone] }, style]} />;
}

/* ───────────────────────── Tappable ─────────────────────────
   Every touch target shrinks slightly and fires a light haptic. */

export function Tappable({
  children,
  style,
  scaleTo = 0.97,
  onPress,
  silent,
  ...rest
}: Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  silent?: boolean;
  children: ReactNode;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) =>
    Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 6 }).start();

  // Layout props must live on the Pressable (the actual flex child); visuals stay on the animated view.
  const { outer, inner } = splitLayout(style);

  return (
    <Pressable
      {...rest}
      style={outer}
      onPressIn={() => to(scaleTo)}
      onPressOut={() => to(1)}
      onPress={(e) => {
        if (!silent) haptic.tap();
        onPress?.(e);
      }}
    >
      <Animated.View style={[inner, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

const LAYOUT_KEYS = [
  'flex', 'flexGrow', 'flexShrink', 'flexBasis', 'alignSelf', 'position', 'top', 'left', 'right', 'bottom', 'zIndex',
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginHorizontal', 'marginVertical',
] as const;

function splitLayout(style: StyleProp<ViewStyle>) {
  const flat = { ...(StyleSheet.flatten(style) ?? {}) } as Record<string, unknown>;
  const outer: Record<string, unknown> = {};
  for (const k of LAYOUT_KEYS) {
    if (k in flat) {
      outer[k] = flat[k];
      delete flat[k];
    }
  }
  return { outer: outer as ViewStyle, inner: flat as ViewStyle };
}

/* ───────────────────────── Button ───────────────────────── */

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading,
  disabled,
  style,
}: {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'plain';
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const isPrimary = variant === 'primary';
  const fg = isPrimary ? colors.onMint : variant === 'plain' ? colors.mint : colors.text;

  const content = (
    <View style={styles.buttonInner}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={19} color={fg} />}
          <Text variant="headline" style={{ color: fg }}>
            {title}
          </Text>
        </>
      )}
    </View>
  );

  return (
    <Tappable
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, variant === 'secondary' && styles.buttonSecondary, disabled && { opacity: 0.4 }, style]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {isPrimary ? (
        <LinearGradient
          colors={gradients.mint}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {content}
    </Tappable>
  );
}

/* ───────────────────────── Card ───────────────────────── */

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/* ───────────────────────── Icon tile (Settings-style) ───────────────────────── */

export function IconTile({
  name,
  color = colors.blue,
  size = 30,
  iconColor = '#fff',
}: {
  name: IconName;
  color?: string;
  size?: number;
  iconColor?: string;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name={name} size={size * 0.56} color={iconColor} />
    </View>
  );
}

/* ───────────────────────── Grouped list ───────────────────────── */

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text variant="title3">{title}</Text>
      {action ? (
        <Tappable onPress={onAction} scaleTo={0.94}>
          <Text variant="subhead" tone="mint">
            {action}
          </Text>
        </Tappable>
      ) : null}
    </View>
  );
}

export function ListGroup({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const items = (Array.isArray(children) ? children : [children]).flat().filter(Boolean);
  return (
    <View style={[styles.group, style]}>
      {items.map((child, i) => (
        <View key={i}>
          {child}
          {i < items.length - 1 ? <View style={styles.separator} /> : null}
        </View>
      ))}
    </View>
  );
}

export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  value,
  onPress,
  chevron = !!onPress,
  destructive,
}: {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  value?: string;
  onPress?: () => void;
  chevron?: boolean;
  destructive?: boolean;
}) {
  const body = (
    <View style={styles.row}>
      {leading}
      <View style={{ flex: 1 }}>
        <Text variant="body" style={destructive && { color: colors.danger }} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="footnote" tone="secondary" numberOfLines={1} style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text variant="body" tone="secondary">
          {value}
        </Text>
      ) : null}
      {trailing}
      {chevron ? <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} /> : null}
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable onPress={() => { haptic.tap(); onPress(); }} style={({ pressed }) => pressed && { backgroundColor: colors.surfacePressed }}>
      {body}
    </Pressable>
  );
}

/* ───────────────────────── Text field ───────────────────────── */

export function TextField({
  label,
  icon,
  style,
  ...rest
}: TextInputProps & { label?: string; icon?: IconName; style?: StyleProp<ViewStyle> }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={style}>
      {label ? (
        <Text variant="footnote" tone="secondary" style={styles.fieldLabel}>
          {label}
        </Text>
      ) : null}
      <View style={[styles.field, focused && styles.fieldFocused]}>
        {icon ? <Ionicons name={icon} size={19} color={focused ? colors.mint : colors.textTertiary} /> : null}
        <TextInput
          placeholderTextColor={colors.textTertiary}
          selectionColor={colors.mint}
          {...rest}
          onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
          style={[type.body, styles.input]}
        />
      </View>
    </View>
  );
}

/* ───────────────────────── Segmented control ───────────────────────── */

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; icon?: IconName }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const [width, setWidth] = useState(0);
  const index = options.findIndex((o) => o.value === value);
  const x = useRef(new Animated.Value(index)).current;
  const segW = width ? (width - 4) / options.length : 0;

  const select = (v: T, i: number) => {
    haptic.select();
    Animated.spring(x, { toValue: i, useNativeDriver: true, speed: 22, bounciness: 4 }).start();
    onChange(v);
  };

  return (
    <View style={styles.segment} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {segW > 0 && (
        <Animated.View
          style={[
            styles.segmentThumb,
            { width: segW, transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [0, segW] }) }] },
          ]}
        />
      )}
      {options.map((o, i) => (
        <Pressable key={o.value} style={styles.segmentItem} onPress={() => select(o.value, i)} accessibilityRole="tab" accessibilityState={{ selected: o.value === value }}>
          {o.icon ? <Ionicons name={o.icon} size={16} color={o.value === value ? colors.text : colors.textSecondary} /> : null}
          <Text variant="subhead" tone={o.value === value ? 'primary' : 'secondary'} style={o.value === value && font('semibold')}>
            {o.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

/* ───────────────────────── Styles ───────────────────────── */

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: radius.md + 2,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  group: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    overflow: 'hidden',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.hairline,
    marginLeft: 58,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 54,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  fieldLabel: {
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  fieldFocused: {
    borderColor: 'rgba(45,212,164,0.55)',
    backgroundColor: colors.surfaceRaised,
  },
  input: {
    flex: 1,
    color: colors.text,
    height: '100%',
    outlineWidth: 0, // web: remove the browser focus ring
  },
  segment: {
    flexDirection: 'row',
    padding: 2,
    height: 40,
    borderRadius: radius.sm + 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  segmentThumb: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    left: 2,
    borderRadius: radius.sm - 1,
    backgroundColor: 'rgba(255,255,255,0.16)',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  segmentItem: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
