import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { haptic } from '@/components/haptics';
import { NavHeader } from '@/components/NavHeader';
import { Screen } from '@/components/Screen';
import { IconName, Tappable, Text } from '@/components/ui';
import { colors, font, gradients, radius, spacing } from '@/theme';

const perks: { icon: IconName; title: string; text: string }[] = [
  { icon: 'eye-off', title: 'Sem anúncios', text: 'Uma experiência limpa, do embarque ao destino.' },
  { icon: 'notifications', title: 'Alarme de aproximação', text: 'Avisamos quando o ônibus estiver chegando à sua parada.' },
  { icon: 'speedometer', title: 'Fluxo de trânsito', text: 'Veja em tempo real onde o trânsito está lento.' },
  { icon: 'share-social', title: 'Compartilhar viagem', text: 'Envie sua localização ao vivo para quem você quiser.' },
];

const plans = [
  { id: 'month', label: 'Mensal', price: 'R$ 6,90', note: 'por mês' },
  { id: 'year', label: 'Anual', price: 'R$ 59,90', note: '2 meses grátis' },
] as const;

export default function Premium() {
  const [plan, setPlan] = useState<(typeof plans)[number]['id']>('year');

  return (
    <Screen modal>
      <NavHeader close />

      <View style={styles.hero}>
        <LinearGradient colors={[colors.gold, colors.goldDeep]} style={styles.badge}>
          <Ionicons name="ribbon" size={40} color="#1A1300" />
        </LinearGradient>
        <Text variant="largeTitle" style={{ textAlign: 'center' }}>
          UniBus <Text variant="largeTitle" tone="gold">Premium</Text>
        </Text>
        <Text variant="callout" tone="secondary" style={styles.sub}>
          Mais tranquilidade em cada viagem.
        </Text>
      </View>

      <View style={{ gap: spacing.xl }}>
        {perks.map((p) => (
          <View key={p.title} style={styles.perk}>
            <View style={styles.perkIcon}>
              <Ionicons name={p.icon} size={20} color={colors.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="headline">{p.title}</Text>
              <Text variant="subhead" tone="secondary" style={{ marginTop: 2 }}>
                {p.text}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.plans}>
        {plans.map((p) => {
          const active = plan === p.id;
          return (
            <Pressable
              key={p.id}
              onPress={() => { haptic.select(); setPlan(p.id); }}
              style={[styles.plan, active && styles.planActive]}
              accessibilityRole="radio"
              accessibilityState={{ checked: active }}
            >
              <Text variant="subhead" tone="secondary">
                {p.label}
              </Text>
              <Text style={styles.price}>{p.price}</Text>
              <Text variant="caption" tone={active ? 'gold' : 'tertiary'}>
                {p.note}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Tappable onPress={() => router.back()} style={styles.cta}>
        <LinearGradient colors={gradients.premium} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        <Text variant="headline" style={{ color: '#fff' }}>
          Assinar Premium
        </Text>
      </Tappable>
      <Text variant="caption" tone="tertiary" style={{ textAlign: 'center', marginTop: spacing.md }}>
        Cancele quando quiser.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginBottom: spacing.xxl },
  badge: {
    width: 84,
    height: 84,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    shadowColor: colors.gold,
    shadowOpacity: 0.45,
    shadowRadius: 30,
    elevation: 10,
  },
  sub: { textAlign: 'center', marginTop: spacing.sm },
  perk: { flexDirection: 'row', gap: spacing.lg, alignItems: 'flex-start' },
  perkIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(242,183,5,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plans: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xxxl, marginBottom: spacing.xl },
  plan: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.hairline,
    gap: 2,
  },
  planActive: { borderColor: colors.gold, backgroundColor: 'rgba(242,183,5,0.08)' },
  price: { color: colors.text, fontSize: 22, lineHeight: 28, ...font('bold') },
  cta: {
    height: 54,
    borderRadius: radius.md + 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(242,183,5,0.5)',
  },
});
