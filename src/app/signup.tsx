import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { NavHeader } from '@/components/NavHeader';
import { Screen } from '@/components/Screen';
import { Button, Text, TextField } from '@/components/ui';
import { maskCard, maskCEP, maskCPF } from '@/utils/masks';
import { colors, radius, spacing } from '@/theme';

const steps = [
  { title: 'Crie seu acesso', subtitle: 'Use um e-mail que você acessa com frequência.' },
  { title: 'Seus dados', subtitle: 'Vinculamos seu cartão de transporte à sua conta.' },
];

export default function Signup() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', password: '', card: '', cpf: '', address: '', cep: '' });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const next = () => (step === 0 ? setStep(1) : router.replace('/(tabs)'));

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <NavHeader
          right={
            <Text variant="footnote" tone="secondary">
              Etapa {step + 1} de 2
            </Text>
          }
        />

        <View style={styles.progress}>
          {steps.map((_, i) => (
            <View key={i} style={[styles.bar, i <= step && styles.barActive]} />
          ))}
        </View>

        <Text variant="largeTitle">{steps[step].title}</Text>
        <Text variant="callout" tone="secondary" style={{ marginTop: spacing.sm, marginBottom: spacing.xxl }}>
          {steps[step].subtitle}
        </Text>

        {step === 0 ? (
          <View style={styles.fields}>
            <TextField label="Nome completo" icon="person-outline" placeholder="Como está no documento" value={form.name} onChangeText={set('name')} textContentType="name" />
            <TextField label="E-mail" icon="mail-outline" placeholder="voce@email.com" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" />
            <TextField label="Senha" icon="lock-closed-outline" placeholder="Mínimo de 8 caracteres" value={form.password} onChangeText={set('password')} secureTextEntry textContentType="newPassword" />
          </View>
        ) : (
          <View style={styles.fields}>
            <TextField label="Número do cartão de transporte" icon="card-outline" placeholder="0000 0000 0000 0000" value={form.card} onChangeText={(v) => set('card')(maskCard(v))} keyboardType="number-pad" />
            <TextField label="CPF" icon="id-card-outline" placeholder="000.000.000-00" value={form.cpf} onChangeText={(v) => set('cpf')(maskCPF(v))} keyboardType="number-pad" />
            <TextField label="Endereço" icon="home-outline" placeholder="Rua, número – bairro" value={form.address} onChangeText={set('address')} />
            <TextField label="CEP" icon="location-outline" placeholder="00000-000" value={form.cep} onChangeText={(v) => set('cep')(maskCEP(v))} keyboardType="number-pad" />
          </View>
        )}

        <Button title={step === 0 ? 'Continuar' : 'Criar conta'} onPress={next} style={{ marginTop: spacing.xxl }} />
        {step === 1 ? (
          <Text variant="footnote" tone="tertiary" style={styles.legal}>
            Ao criar a conta, você concorda com os Termos de Uso e a Política de Privacidade.
          </Text>
        ) : null}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  progress: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xxl },
  bar: { flex: 1, height: 4, borderRadius: radius.pill, backgroundColor: colors.surfaceRaised },
  barActive: { backgroundColor: colors.mint },
  fields: { gap: spacing.lg },
  legal: { textAlign: 'center', marginTop: spacing.lg, paddingHorizontal: spacing.lg },
});
