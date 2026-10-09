import { StyleSheet, View } from 'react-native';
import { Stop } from '@/data/mock';
import { colors, font, radius, spacing } from '@/theme';
import { IconTile, ListRow, Text } from './ui';

const distance = (m: number) => (m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1).replace('.', ',')} km`);

export function LineChip({ code, active }: { code: string; active?: boolean }) {
  return (
    <View style={[styles.chip, active && { backgroundColor: colors.mint }]}>
      <Text variant="caption" style={[styles.chipText, active && { color: colors.onMint }]}>
        {code}
      </Text>
    </View>
  );
}

export function Eta({ minutes }: { minutes: number }) {
  return (
    <View style={styles.eta}>
      <Text style={styles.etaValue}>{minutes}</Text>
      <Text variant="caption" tone="secondary">
        min
      </Text>
    </View>
  );
}

/** A stop with its next departure. */
export function StopRow({ stop, onPress }: { stop: Stop; onPress?: () => void }) {
  const next = stop.lines[0];
  return (
    <ListRow
      title={stop.name}
      subtitle={`${distance(stop.distance)} · ${stop.direction}`}
      leading={<IconTile name="bus" color={colors.blue} size={34} />}
      trailing={
        <View style={styles.trailing}>
          <LineChip code={next.code} />
          <Eta minutes={next.eta} />
        </View>
      }
      onPress={onPress}
      chevron={false}
    />
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
    backgroundColor: 'rgba(79,155,224,0.18)',
  },
  chipText: { color: '#8CC4F5', ...font('bold'), letterSpacing: 0.3 },
  trailing: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  eta: { alignItems: 'center', minWidth: 32, borderRadius: radius.sm },
  etaValue: { color: colors.mint, fontSize: 20, lineHeight: 22, ...font('bold') },
});
