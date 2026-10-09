import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { NavHeader } from '@/components/NavHeader';
import { Screen } from '@/components/Screen';
import { Button, Tappable, Text, TextField } from '@/components/ui';
import { user } from '@/data/mock';
import { maskCEP, maskCPF } from '@/utils/masks';
import { spacing } from '@/theme';

export default function Profile() {
  const [form, setForm] = useState({ ...user });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Screen modal>
      <NavHeader close />
      <View style={styles.hero}>
        <Avatar size={88} onPress={() => {}} />
        <Tappable scaleTo={0.95} style={{ marginTop: spacing.md }}>
          <Text variant="subhead" tone="mint">
            Alterar foto
          </Text>
        </Tappable>
      </View>

      <Text variant="footnote" tone="secondary" style={styles.label}>
        CONTA
      </Text>
      <View style={styles.fields}>
        <TextField label="Nome" icon="person-outline" value={form.name} onChangeText={set('name')} />
        <TextField label="E-mail" icon="mail-outline" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" />
        <TextField label="Nova senha" icon="lock-closed-outline" placeholder="Deixe em branco para manter" secureTextEntry />
      </View>

      <Text variant="footnote" tone="secondary" style={styles.label}>
        MEUS DADOS
      </Text>
      <View style={styles.fields}>
        <TextField label="Cartão de transporte" icon="card-outline" value={form.card} editable={false} />
        <TextField label="CPF" icon="id-card-outline" value={form.cpf} onChangeText={(v) => set('cpf')(maskCPF(v))} keyboardType="number-pad" />
        <TextField label="Endereço" icon="home-outline" value={form.address} onChangeText={set('address')} />
        <TextField label="CEP" icon="location-outline" value={form.cep} onChangeText={(v) => set('cep')(maskCEP(v))} keyboardType="number-pad" />
      </View>

      <Button title="Salvar alterações" onPress={() => router.back()} style={{ marginTop: spacing.xxl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginBottom: spacing.lg },
  label: { marginTop: spacing.xl, marginBottom: spacing.md, marginLeft: spacing.xs, letterSpacing: 0.5 },
  fields: { gap: spacing.lg },
});
