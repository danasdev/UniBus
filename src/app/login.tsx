import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { LogoMark } from '@/components/Logo';
import { NavHeader } from '@/components/NavHeader';
import { Screen } from '@/components/Screen';
import { Button, Tappable, Text, TextField } from '@/components/ui';
import { spacing } from '@/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    // TODO: connect to the auth API
    setTimeout(() => router.replace('/(tabs)'), 700);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <NavHeader />
        <LogoMark size={56} />
        <Text variant="largeTitle" style={styles.title}>
          Bem-vindo{'\n'}de volta
        </Text>
        <Text variant="callout" tone="secondary" style={{ marginBottom: spacing.xxl }}>
          Entre para pagar sua passagem e acompanhar seus ônibus.
        </Text>

        <View style={{ gap: spacing.md }}>
          <TextField
            icon="mail-outline"
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
          />
          <TextField
            icon="lock-closed-outline"
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            onSubmitEditing={submit}
          />
        </View>

        <Tappable style={styles.forgot} scaleTo={0.95}>
          <Text variant="subhead" tone="mint">
            Esqueci minha senha
          </Text>
        </Tappable>

        <Button title="Entrar" onPress={submit} loading={loading} />

        <View style={styles.footer}>
          <Text variant="subhead" tone="secondary">
            Ainda não tem conta?{' '}
          </Text>
          <Tappable onPress={() => router.replace('/signup')} scaleTo={0.95}>
            <Text variant="subhead" tone="mint">
              Criar conta
            </Text>
          </Tappable>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.xl, marginBottom: spacing.sm },
  forgot: { alignSelf: 'flex-end', marginTop: spacing.md, marginBottom: spacing.xxl },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
});
