import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Platform, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BusMap, BusMapHandle } from '@/components/BusMap';
import { haptic } from '@/components/haptics';
import { Eta, LineChip, StopRow } from '@/components/StopRow';
import { IconTile, ListGroup, ListRow, Tappable, Text } from '@/components/ui';
import { Stop, stops } from '@/data/mock';
import { colors, radius, spacing, TAB_BAR_HEIGHT } from '@/theme';

function Glass({ children, style }: { children: React.ReactNode; style?: object }) {
  return (
    <View style={[styles.glass, style]}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={40} tint="systemChromeMaterialDark" style={StyleSheet.absoluteFill} />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.glassFallback]} />
      )}
      {children}
    </View>
  );
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const params = useLocalSearchParams<{ stop?: string }>();
  const map = useRef<BusMapHandle>(null);
  const [selected, setSelected] = useState<Stop | null>(null);

  // Bottom sheet: translateY 0 = expanded, `collapsedOffset` = peeking
  const tabSpace = TAB_BAR_HEIGHT + Math.max(insets.bottom, spacing.md) + spacing.md;
  const sheetHeight = Math.round(height * 0.58) + tabSpace;
  const peek = 200 + tabSpace;
  const collapsedOffset = sheetHeight - peek;
  const y = useRef(new Animated.Value(collapsedOffset)).current;
  const current = useRef(collapsedOffset);

  const snap = (to: number) => {
    current.current = to;
    Animated.spring(y, { toValue: to, useNativeDriver: true, speed: 16, bounciness: 3 }).start();
  };

  const pan = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
        onPanResponderMove: (_, g) => y.setValue(Math.min(collapsedOffset, Math.max(0, current.current + g.dy))),
        onPanResponderRelease: (_, g) => {
          const end = current.current + g.dy;
          const open = g.vy < -0.4 || (g.vy < 0.4 && end < collapsedOffset / 2);
          haptic.select();
          snap(open ? 0 : collapsedOffset);
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [collapsedOffset],
  );

  const select = (s: Stop | null) => {
    setSelected(s);
    if (s) {
      map.current?.focus(s);
      snap(collapsedOffset * 0.35);
    }
  };

  useEffect(() => {
    const s = stops.find((x) => x.id === params.stop);
    if (s) select(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.stop]);

  return (
    <View style={styles.fill}>
      <BusMap ref={map} stops={stops} selectedId={selected?.id} onSelectStop={select} style={StyleSheet.absoluteFill} />

      {/* Floating search + recenter */}
      <View style={[styles.top, { paddingTop: insets.top + spacing.sm }]} pointerEvents="box-none">
        <Glass style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <Text variant="body" tone="tertiary" style={{ flex: 1 }}>
            Buscar destino ou linha
          </Text>
        </Glass>
        <Tappable onPress={() => map.current?.recenter()} scaleTo={0.9} accessibilityLabel="Centralizar">
          <Glass style={styles.roundBtn}>
            <Ionicons name="locate" size={20} color={colors.mint} />
          </Glass>
        </Tappable>
      </View>

      {/* Bottom sheet */}
      <Animated.View
        style={[styles.sheet, { height: sheetHeight, transform: [{ translateY: y }] }]}
      >
        <Glass style={StyleSheet.absoluteFill}>{null}</Glass>
        <View {...pan.panHandlers} style={styles.handleArea}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <Text variant="title3">{selected ? selected.name : 'Ao redor'}</Text>
            {selected ? (
              <Tappable onPress={() => { setSelected(null); snap(collapsedOffset); }} scaleTo={0.9} style={styles.closeBtn} accessibilityLabel="Fechar parada">
                <Ionicons name="close" size={16} color={colors.text} />
              </Tappable>
            ) : (
              <Text variant="footnote" tone="secondary">
                {stops.length} paradas
              </Text>
            )}
          </View>
          {selected ? (
            <Text variant="footnote" tone="secondary" style={{ paddingHorizontal: spacing.xl }}>
              {selected.direction} · {selected.distance} m de você
            </Text>
          ) : null}
        </View>

        <ScrollView contentContainerStyle={[styles.sheetContent, { paddingBottom: tabSpace + spacing.lg }]} showsVerticalScrollIndicator={false}>
          {selected ? (
            <>
              <Text variant="footnote" tone="secondary" style={styles.groupLabel}>
                PRÓXIMAS PARTIDAS
              </Text>
              <ListGroup>
                {selected.lines.map((l, i) => (
                  <ListRow
                    key={l.code}
                    title={l.name}
                    subtitle={i === 0 ? 'Chegando' : 'Em trânsito'}
                    leading={<LineChip code={l.code} active={i === 0} />}
                    trailing={<Eta minutes={l.eta} />}
                    chevron={false}
                  />
                ))}
              </ListGroup>
              <ListGroup style={{ marginTop: spacing.lg }}>
                <ListRow title="Avisar quando estiver chegando" leading={<IconTile name="notifications" color={colors.gold} />} onPress={() => {}} />
                <ListRow title="Traçar rota até a parada" leading={<IconTile name="walk" color={colors.teal} />} onPress={() => {}} />
              </ListGroup>
            </>
          ) : (
            <ListGroup>
              {stops.map((s) => (
                <StopRow key={s.id} stop={s} onPress={() => select(s)} />
              ))}
            </ListGroup>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.bgTop },
  top: { position: 'absolute', left: spacing.lg, right: spacing.lg, flexDirection: 'row', gap: spacing.sm },
  glass: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  glassFallback: {
    backgroundColor: 'rgba(8,24,21,0.9)',
    // web-only: frosted glass
    backdropFilter: 'blur(24px) saturate(160%)',
  },
  search: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  roundBtn: { width: 48, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: 'hidden',
  },
  handleArea: { paddingBottom: spacing.md },
  handle: {
    alignSelf: 'center',
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.28)',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetContent: { paddingHorizontal: spacing.lg },
  groupLabel: { marginLeft: spacing.lg, marginBottom: spacing.sm, letterSpacing: 0.5 },
});
