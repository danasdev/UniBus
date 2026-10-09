import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { colors, font, gradients } from '@/theme';
import { Text } from './ui';

export function LogoMark({ size = 64 }: { size?: number }) {
  return (
    <LinearGradient
      colors={gradients.brand}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.mark, { width: size, height: size, borderRadius: size * 0.27 }]}
    >
      <Ionicons name="bus" size={size * 0.5} color="#fff" />
      <View style={[styles.dot, { width: size * 0.2, height: size * 0.2, borderRadius: size * 0.1, top: size * 0.12, right: size * 0.12 }]} />
    </LinearGradient>
  );
}

export function Logo({ size = 64, tagline = true }: { size?: number; tagline?: boolean }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <LogoMark size={size} />
      <Text style={[styles.word, { fontSize: size * 0.56, lineHeight: size * 0.68, marginTop: size * 0.22 }]}>
        <Text style={[styles.word, { color: '#4F9BE0', fontSize: size * 0.56 }]}>Uni</Text>
        <Text style={[styles.word, { color: colors.mint, fontSize: size * 0.56 }]}>Bus</Text>
      </Text>
      {tagline ? (
        <Text variant="caption" tone="tertiary" style={styles.tagline}>
          TRANSPORTE E PAGAMENTO DIGITAL
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.mint,
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
  },
  dot: {
    position: 'absolute',
    backgroundColor: colors.mintLight,
    borderWidth: 2,
    borderColor: '#0C6E88',
  },
  word: { ...font('bold'), letterSpacing: -0.5 },
  tagline: { letterSpacing: 2.2, marginTop: 6, fontSize: 10 },
});
