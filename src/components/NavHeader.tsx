import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { Tappable } from './ui';

/** Back button row for pushed (non-tab) screens. */
export function NavHeader({ right, close }: { right?: ReactNode; close?: boolean }) {
  const back = () => (router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <View style={styles.row}>
      <Tappable onPress={back} style={styles.btn} scaleTo={0.9} accessibilityLabel={close ? 'Fechar' : 'Voltar'}>
        <Ionicons name={close ? 'close' : 'chevron-back'} size={22} color={colors.text} />
      </Tappable>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  btn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
