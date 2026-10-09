import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { PremiumCard } from '@/components/PremiumCard';
import { Screen } from '@/components/Screen';
import { IconTile, ListGroup, ListRow, Tappable, Text } from '@/components/ui';
import { user } from '@/data/mock';
import { colors, spacing } from '@/theme';

export default function Settings() {
  const [notify, setNotify] = useState(true);

  return (
    <Screen tab title="Conta">
      <Tappable onPress={() => router.push('/profile')} style={styles.profile} scaleTo={0.98}>
        <Avatar size={60} />
        <View style={{ flex: 1 }}>
          <Text variant="title3">{user.name}</Text>
          <Text variant="subhead" tone="secondary">
            {user.email}
          </Text>
        </View>
      </Tappable>

      <PremiumCard onPress={() => router.push('/premium')} />

      <ListGroup style={styles.group}>
        <ListRow title="Informações pessoais" leading={<IconTile name="person" color={colors.blue} />} onPress={() => router.push('/profile')} />
        <ListRow title="Formas de pagamento" leading={<IconTile name="card" color={colors.teal} />} onPress={() => router.push('/recharge')} />
        <ListRow title="Meu cartão" value="•• 4821" leading={<IconTile name="bus" color="#3B82F6" />} onPress={() => {}} />
      </ListGroup>

      <ListGroup style={styles.group}>
        <ListRow
          title="Notificações"
          leading={<IconTile name="notifications" color="#E5484D" />}
          trailing={
            <Switch
              value={notify}
              onValueChange={setNotify}
              trackColor={{ true: colors.mint, false: 'rgba(255,255,255,0.16)' }}
              thumbColor="#fff"
              ios_backgroundColor="rgba(255,255,255,0.16)"
            />
          }
        />
        <ListRow title="Aparência" value="Escuro" leading={<IconTile name="contrast" color="#6E56CF" />} onPress={() => {}} />
        <ListRow title="Privacidade e segurança" leading={<IconTile name="lock-closed" color="#5B6B67" />} onPress={() => {}} />
        <ListRow title="Ajuda" leading={<IconTile name="help-buoy" color={colors.goldDeep} />} onPress={() => {}} />
      </ListGroup>

      <ListGroup style={styles.group}>
        <ListRow title="Sair da conta" destructive chevron={false} onPress={() => router.replace('/')} />
      </ListGroup>

      <Text variant="caption" tone="tertiary" style={styles.version}>
        UniBus 1.0.0 · fastsolucion.inc
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profile: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.xl },
  group: { marginTop: spacing.xl },
  version: { textAlign: 'center', marginTop: spacing.xl },
});
