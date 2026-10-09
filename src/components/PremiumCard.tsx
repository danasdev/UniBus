import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { colors, gradients, radius, spacing } from '@/theme';
import { Tappable, Text } from './ui';

/** Black → gold card, carried over from the original "Vantagens premium" banner. */
export function PremiumCard({ onPress }: { onPress?: () => void }) {
  return (
    <Tappable onPress={onPress} scaleTo={0.98}>
      <LinearGradient colors={gradients.premium} start={{ x: 0, y: 0.2 }} end={{ x: 1, y: 0.8 }} style={styles.card}>
        <View style={styles.badge}>
          <Ionicons name="ribbon" size={22} color="#1A1300" />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="headline" style={{ color: '#fff' }}>
            UniBus Premium
          </Text>
          <Text variant="footnote" style={{ color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
            Sem anúncios e com alerta de chegada
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.8)" />
      </LinearGradient>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(242,183,5,0.4)',
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
