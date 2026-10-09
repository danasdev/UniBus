import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Button, IconTile, ListGroup, ListRow, SectionHeader, Text } from '@/components/ui';
import { WalletCard } from '@/components/WalletCard';
import { formatBRL } from '@/data/mock';
import { useWallet } from '@/state/wallet';
import { colors, font, spacing } from '@/theme';

export default function Wallet() {
  const { transactions } = useWallet();

  return (
    <Screen tab title="Carteira">
      <WalletCard />

      <View style={styles.actions}>
        <Button title="Recarregar" icon="add-circle" onPress={() => router.push('/recharge')} style={{ flex: 1 }} />
        <Button title="Pagar" icon="qr-code" variant="secondary" onPress={() => router.navigate('/ticket')} style={{ flex: 1 }} />
      </View>

      <SectionHeader title="Atividade" />
      <ListGroup>
        {transactions.map((t) => {
          const credit = t.amount > 0;
          return (
            <ListRow
              key={t.id}
              title={t.title}
              subtitle={t.subtitle}
              leading={
                <IconTile
                  name={credit ? 'arrow-down' : 'bus'}
                  color={credit ? 'rgba(45,212,164,0.18)' : 'rgba(79,155,224,0.18)'}
                  iconColor={credit ? colors.mint : '#8CC4F5'}
                  size={36}
                />
              }
              trailing={
                <Text style={[styles.amount, { color: credit ? colors.mint : colors.text }]}>
                  {credit ? '+' : '−'} {formatBRL(t.amount)}
                </Text>
              }
            />
          );
        })}
      </ListGroup>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  amount: { fontSize: 16, ...font('semibold') },
});
