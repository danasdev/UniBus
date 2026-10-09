import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { user } from '@/data/mock';
import { colors, font } from '@/theme';
import { Tappable, Text } from './ui';

export function Avatar({ size = 40, onPress = () => router.push('/profile') }: { size?: number; onPress?: () => void }) {
  return (
    <Tappable onPress={onPress} scaleTo={0.92} accessibilityLabel="Perfil">
      <LinearGradient colors={[colors.blue, colors.teal]} style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={[styles.text, { fontSize: size * 0.4 }]}>{user.name[0]}</Text>
      </LinearGradient>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.18)' },
  text: { color: '#fff', ...font('semibold') },
});
