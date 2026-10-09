import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { QRCode } from '@/components/QRCode';
import { Screen } from '@/components/Screen';
import { Card, SegmentedControl, Tappable, Text } from '@/components/ui';
import { FARE, formatBRL, user } from '@/data/mock';
import { useWallet } from '@/state/wallet';
import { colors, font, radius, spacing } from '@/theme';

const REFRESH = 30;

function QRPane() {
  const [seconds, setSeconds] = useState(REFRESH);
  const [token, setToken] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setToken(Date.now());
          return REFRESH;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.pane}>
      <View style={styles.qrCard}>
        <QRCode value={`unibus:${user.card}:${token}`} size={216} />
      </View>
      <View style={styles.refresh}>
        <Ionicons name="shield-checkmark" size={14} color={colors.mint} />
        <Text variant="footnote" tone="secondary">
          Código seguro · atualiza em {seconds}s
        </Text>
      </View>
      <Text variant="callout" tone="secondary" style={styles.hint}>
        Aponte o código para o leitor do validador.
      </Text>
    </View>
  );
}

function Ring({ delay }: { delay: number }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(v, { toValue: 1, duration: 2200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v, delay]);
  return (
    <Animated.View
      style={[
        styles.ring,
        {
          opacity: v.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.7, 0] }),
          transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1.35] }) }],
        },
      ]}
    />
  );
}

function NfcPane() {
  return (
    <View style={styles.pane}>
      <View style={styles.nfcStage}>
        <Ring delay={0} />
        <Ring delay={730} />
        <Ring delay={1460} />
        <View style={styles.nfcCore}>
          <Ionicons name="phone-portrait-outline" size={44} color={colors.onMint} />
        </View>
      </View>
      <Text variant="title3" style={{ marginTop: spacing.lg }}>
        Pronto para aproximar
      </Text>
      <Text variant="callout" tone="secondary" style={styles.hint}>
        Encoste a parte de trás do celular no validador até sentir a vibração.
      </Text>
    </View>
  );
}

export default function Ticket() {
  const [mode, setMode] = useState<'qr' | 'nfc'>('qr');
  const { balance } = useWallet();
  const low = balance < FARE;

  return (
    <Screen tab title="Passagem">
      <SegmentedControl
        value={mode}
        onChange={setMode}
        options={[
          { value: 'qr', label: 'QR Code', icon: 'qr-code-outline' },
          { value: 'nfc', label: 'Aproximação', icon: 'radio-outline' },
        ]}
      />

      {mode === 'qr' ? <QRPane /> : <NfcPane />}

      <Card style={styles.balance}>
        <View style={{ flex: 1 }}>
          <Text variant="footnote" tone="secondary">
            Saldo · tarifa {formatBRL(FARE)}
          </Text>
          <Text style={[styles.balanceValue, low && { color: colors.danger }]}>{formatBRL(balance)}</Text>
        </View>
        <Tappable onPress={() => router.push('/recharge')} style={styles.add} scaleTo={0.9} accessibilityLabel="Recarregar">
          <Ionicons name="add" size={22} color={colors.onMint} />
        </Tappable>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pane: { alignItems: 'center', paddingTop: spacing.xxl, minHeight: 400 },
  qrCard: {
    padding: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: '#fff',
    shadowColor: colors.mint,
    shadowOpacity: 0.25,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  refresh: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.lg },
  hint: { textAlign: 'center', marginTop: spacing.sm, paddingHorizontal: spacing.xl },
  nfcStage: { width: 260, height: 260, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 2,
    borderColor: colors.mint,
  },
  nfcCore: {
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
  balance: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xl },
  balanceValue: { color: colors.text, fontSize: 26, lineHeight: 32, ...font('bold'), marginTop: 2 },
  add: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
});
