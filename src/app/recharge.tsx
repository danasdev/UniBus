import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { haptic } from '@/components/haptics';
import { NavHeader } from '@/components/NavHeader';
import { Screen } from '@/components/Screen';
import { Button, IconName, IconTile, ListGroup, ListRow, Text, TextField } from '@/components/ui';
import { formatBRL, rechargeAmounts } from '@/data/mock';
import { PaymentMethod, useWallet } from '@/state/wallet';
import { colors, font, radius, spacing } from '@/theme';

const methods: { id: PaymentMethod; title: string; subtitle: string; icon: IconName; color: string }[] = [
  { id: 'pix', title: 'Pix', subtitle: 'Aprovação na hora', icon: 'flash', color: colors.teal },
  { id: 'card', title: 'Crédito ou débito', subtitle: 'Visa •• 1029', icon: 'card', color: colors.blue },
  { id: 'transfer', title: 'Trazer de outra conta', subtitle: 'Transferir saldo UniBus', icon: 'swap-horizontal', color: '#6E56CF' },
];

function Success({ amount }: { amount: number }) {
  const s = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    haptic.success();
    Animated.spring(s, { toValue: 1, useNativeDriver: true, speed: 8, bounciness: 12 }).start();
  }, [s]);
  return (
    <View style={styles.success}>
      <Animated.View style={[styles.check, { transform: [{ scale: s }] }]}>
        <Ionicons name="checkmark" size={56} color={colors.onMint} />
      </Animated.View>
      <Text variant="title1" style={{ marginTop: spacing.xxl }}>
        Recarga concluída
      </Text>
      <Text variant="callout" tone="secondary" style={{ marginTop: spacing.sm, textAlign: 'center' }}>
        {formatBRL(amount)} já estão disponíveis no seu saldo.
      </Text>
      <Button title="Concluir" onPress={() => router.back()} style={{ alignSelf: 'stretch', marginTop: spacing.xxxl }} />
    </View>
  );
}

export default function Recharge() {
  const { topUp } = useWallet();
  const [amount, setAmount] = useState(15);
  const [custom, setCustom] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');

  const value = custom ? Number(custom.replace(',', '.')) || 0 : amount;

  const confirm = () => {
    setState('loading');
    setTimeout(() => {
      topUp(value, method);
      setState('done');
    }, 900);
  };

  if (state === 'done') {
    return (
      <Screen modal scroll={false}>
        <Success amount={value} />
      </Screen>
    );
  }

  return (
    <Screen modal>
      <NavHeader close />
      <Text variant="largeTitle">Recarregar</Text>
      <Text variant="callout" tone="secondary" style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
        Escolha quanto quer adicionar.
      </Text>

      <View style={styles.grid}>
        {rechargeAmounts.map((a) => {
          const active = !custom && a === amount;
          return (
            <Pressable
              key={a}
              onPress={() => { haptic.select(); setCustom(''); setAmount(a); }}
              style={[styles.amount, active && styles.amountActive]}
              accessibilityRole="radio"
              accessibilityState={{ checked: active }}
            >
              <Text variant="caption" style={{ color: active ? colors.onMint : colors.textSecondary }}>
                R$
              </Text>
              <Text style={[styles.amountText, active && { color: colors.onMint }]}>{a}</Text>
            </Pressable>
          );
        })}
      </View>

      <TextField
        icon="create-outline"
        placeholder="Outro valor"
        value={custom}
        onChangeText={(v) => setCustom(v.replace(/[^\d,]/g, ''))}
        keyboardType="decimal-pad"
        style={{ marginTop: spacing.md }}
      />

      <Text variant="footnote" tone="secondary" style={styles.label}>
        PAGAR COM
      </Text>
      <ListGroup>
        {methods.map((m) => (
          <ListRow
            key={m.id}
            title={m.title}
            subtitle={m.subtitle}
            leading={<IconTile name={m.icon} color={m.color} size={34} />}
            trailing={
              <Ionicons
                name={method === m.id ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={method === m.id ? colors.mint : colors.textTertiary}
              />
            }
            chevron={false}
            onPress={() => setMethod(m.id)}
          />
        ))}
      </ListGroup>

      <View style={styles.summary}>
        <Text variant="callout" tone="secondary">
          Total
        </Text>
        <Text variant="title2">{formatBRL(value)}</Text>
      </View>

      <Button
        title={`Recarregar ${formatBRL(value)}`}
        onPress={confirm}
        loading={state === 'loading'}
        disabled={value < 1}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  amount: {
    width: '30%',
    flexGrow: 1,
    height: 76,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountActive: { backgroundColor: colors.mint, borderColor: colors.mintLight },
  amountText: { color: colors.text, fontSize: 26, lineHeight: 30, ...font('bold') },
  label: { marginTop: spacing.xxl, marginBottom: spacing.sm, marginLeft: spacing.lg, letterSpacing: 0.5 },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  success: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  check: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.mint,
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
});
