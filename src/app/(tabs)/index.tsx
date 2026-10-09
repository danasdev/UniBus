import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { BusMap } from '@/components/BusMap';
import { Screen } from '@/components/Screen';
import { StopRow } from '@/components/StopRow';
import { Card, IconName, ListGroup, SectionHeader, Tappable, Text } from '@/components/ui';
import { formatBRL, stops, user } from '@/data/mock';
import { useWallet } from '@/state/wallet';
import { colors, font, radius, spacing } from '@/theme';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}

function QuickAction({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Tappable onPress={onPress} style={styles.quick}>
      <View style={styles.quickIcon}>
        <Ionicons name={icon} size={22} color={colors.mint} />
      </View>
      <Text variant="footnote" style={font('medium')}>
        {label}
      </Text>
    </Tappable>
  );
}

export default function Home() {
  const { balance } = useWallet();

  return (
    <Screen tab subtitle={`${greeting()},`} title={user.firstName} right={<Avatar />}>
      {/* Destination search */}
      <Tappable onPress={() => router.navigate('/map')} style={styles.search} scaleTo={0.98}>
        <Ionicons name="search" size={19} color={colors.textSecondary} />
        <Text variant="body" tone="tertiary" style={{ flex: 1 }}>
          Para onde vamos?
        </Text>
        <Ionicons name="mic-outline" size={19} color={colors.textTertiary} />
      </Tappable>

      {/* Balance */}
      <Card style={styles.balance}>
        <View style={{ flex: 1 }}>
          <Text variant="footnote" tone="secondary">
            Saldo
          </Text>
          <Text style={styles.balanceValue}>{formatBRL(balance)}</Text>
        </View>
        <Tappable onPress={() => router.push('/recharge')} style={styles.topUp} scaleTo={0.94}>
          <Ionicons name="add" size={18} color={colors.onMint} />
          <Text variant="subhead" style={[{ color: colors.onMint }, font('semibold')]}>
            Recarregar
          </Text>
        </Tappable>
      </Card>

      <View style={styles.quickRow}>
        <QuickAction icon="qr-code-outline" label="Pagar" onPress={() => router.navigate('/ticket')} />
        <QuickAction icon="navigate-outline" label="Rotas" onPress={() => router.navigate('/map')} />
        <QuickAction icon="time-outline" label="Histórico" onPress={() => router.navigate('/wallet')} />
        <QuickAction icon="star-outline" label="Premium" onPress={() => router.push('/premium')} />
      </View>

      {/* Nearby */}
      <SectionHeader title="Perto de você" action="Ver mapa" onAction={() => router.navigate('/map')} />
      <Tappable onPress={() => router.navigate('/map')} scaleTo={0.985}>
        <BusMap stops={stops} interactive={false} style={styles.map} />
      </Tappable>

      <ListGroup style={{ marginTop: spacing.md }}>
        {stops.slice(0, 3).map((s) => (
          <StopRow key={s.id} stop={s} onPress={() => router.navigate({ pathname: '/map', params: { stop: s.id } })} />
        ))}
      </ListGroup>
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 50,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
  },
  balance: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg },
  balanceValue: { color: colors.text, fontSize: 30, lineHeight: 36, letterSpacing: -0.5, ...font('bold'), marginTop: 2 },
  topUp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.lg,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.mint,
  },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xl },
  quick: { alignItems: 'center', gap: spacing.sm, width: 72 },
  quickIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: { height: 170, borderRadius: radius.lg },
});
