import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { FARE, formatBRL, user } from '@/data/mock';
import { useWallet } from '@/state/wallet';
import { colors, font, gradients, radius, spacing } from '@/theme';
import { Text } from './ui';

/** Apple Wallet–style transit card. */
export function WalletCard({ compact }: { compact?: boolean }) {
  const { balance } = useWallet();
  const trips = Math.floor(balance / FARE);
  const [reais, cents] = balance.toFixed(2).split('.');

  return (
    <LinearGradient
      colors={gradients.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, compact && { minHeight: 0, paddingBottom: spacing.xl }]}
    >
      {/* subtle sheen */}
      <View pointerEvents="none" style={styles.sheen} />

      <View style={styles.top}>
        <View style={styles.brand}>
          <Ionicons name="bus" size={16} color="#fff" />
          <Text variant="headline" style={{ color: '#fff' }}>
            UniBus
          </Text>
        </View>
        <Ionicons name="wifi" size={20} color="rgba(255,255,255,0.8)" style={{ transform: [{ rotate: '90deg' }] }} />
      </View>

      <Text variant="footnote" style={styles.label}>
        Saldo disponível
      </Text>
      <Text style={styles.amount}>
        <Text style={styles.currency}>R$ </Text>
        {reais}
        <Text style={styles.cents}>,{cents}</Text>
      </Text>

      {!compact && (
        <View style={styles.bottom}>
          <Text variant="footnote" style={styles.muted} numberOfLines={1}>
            •••• {user.card.slice(-4)}
          </Text>
          <View style={styles.pill}>
            <Text variant="caption" style={{ color: '#fff' }}>
              ≈ {trips} {trips === 1 ? 'passagem' : 'passagens'} · {formatBRL(FARE)}
            </Text>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    minHeight: 200,
    overflow: 'hidden',
    shadowColor: colors.teal,
    shadowOpacity: 0.35,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  sheen: {
    position: 'absolute',
    top: -120,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xxl },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { color: 'rgba(255,255,255,0.75)' },
  amount: { color: '#fff', fontSize: 44, lineHeight: 52, letterSpacing: -1, ...font('bold') },
  currency: { color: '#fff', fontSize: 22, ...font('semibold') },
  cents: { color: 'rgba(255,255,255,0.75)', fontSize: 26, ...font('semibold') },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg },
  muted: { color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
  pill: {
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
});
