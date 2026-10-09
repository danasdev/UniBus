import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from '@/components/Logo';
import { Background } from '@/components/Screen';
import { Button, Text } from '@/components/ui';
import { colors, spacing } from '@/theme';

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const logo = useRef(new Animated.Value(0)).current;
  const actions = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logo, { toValue: 1, useNativeDriver: true, speed: 6, bounciness: 6 }),
      Animated.timing(actions, { toValue: 1, duration: 450, delay: 350, useNativeDriver: true }),
    ]).start();
  }, [logo, actions]);

  const rise = (v: Animated.Value, d: number) => ({
    opacity: v,
    transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [d, 0] }) }],
  });

  return (
    <Background>
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + spacing.lg }]}>
        <Animated.View style={[styles.hero, rise(logo, 24)]}>
          <Logo size={84} />
        </Animated.View>

        <Animated.View style={[styles.bottom, rise(actions, 16)]}>
          <Text variant="title1" style={styles.headline}>
            Sua passagem.{'\n'}No seu bolso.
          </Text>
          <Text variant="callout" tone="secondary" style={styles.sub}>
            Pague com QR Code ou aproximação, recarregue em segundos e veja o ônibus chegando.
          </Text>

          <Button title="Entrar" onPress={() => router.push('/login')} />
          <Button title="Criar conta" variant="secondary" onPress={() => router.push('/signup')} style={{ marginTop: spacing.md }} />

          <Text variant="caption" tone="tertiary" style={styles.footer}>
            from <Text variant="caption" style={{ color: colors.mint }}>fastsolucion.inc</Text>
          </Text>
        </Animated.View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottom: { width: '100%', maxWidth: 480, alignSelf: 'center' },
  headline: { textAlign: 'center' },
  sub: { textAlign: 'center', marginTop: spacing.md, marginBottom: spacing.xxl, paddingHorizontal: spacing.md },
  footer: { textAlign: 'center', marginTop: spacing.xl },
});
