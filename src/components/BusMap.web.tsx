import Ionicons from '@expo/vector-icons/Ionicons';
import { forwardRef, useImperativeHandle } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { Stop, userLocation } from '@/data/mock';
import { colors } from '@/theme';

// react-native-maps has no web support; this is a stylized stand-in for previews.
export type BusMapHandle = { recenter: () => void; focus: (stop: Stop) => void };

type Props = {
  stops: Stop[];
  selectedId?: string;
  onSelectStop?: (stop: Stop) => void;
  interactive?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SPAN = 0.009;
const toPct = (lat: number, lng: number) => ({
  left: `${50 + ((lng - userLocation.longitude) / SPAN) * 100}%` as const,
  top: `${42 - ((lat - userLocation.latitude) / SPAN) * 100}%` as const,
});

export const BusMap = forwardRef<BusMapHandle, Props>(function BusMap({ stops, selectedId, onSelectStop, style }, ref) {
  useImperativeHandle(ref, () => ({ recenter: () => {}, focus: () => {} }));
  const me = toPct(userLocation.latitude, userLocation.longitude);

  return (
    <View style={[styles.wrap, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFill}>
        <Rect width="400" height="600" fill="#0f1c1b" />
        {/* blocks */}
        {Array.from({ length: 9 }).map((_, i) => (
          <Path key={`h${i}`} d={`M-20 ${40 + i * 70} L420 ${20 + i * 72}`} stroke="#1c2d2b" strokeWidth={6} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <Path key={`v${i}`} d={`M${20 + i * 64} -20 L${50 + i * 60} 620`} stroke="#1c2d2b" strokeWidth={6} />
        ))}
        {/* arterials */}
        <Path d="M-20 430 C 120 380, 220 300, 420 120" stroke="#2a5a51" strokeWidth={14} fill="none" />
        <Path d="M-20 250 L 420 330" stroke="#23403b" strokeWidth={10} fill="none" />
      </Svg>

      {stops.map((s) => {
        const active = s.id === selectedId;
        const pos = toPct(s.latitude, s.longitude);
        return (
          <Pressable key={s.id} onPress={() => onSelectStop?.(s)} style={[styles.pinWrap, pos]}>
            <View style={[styles.pin, active && styles.pinActive]}>
              <Ionicons name="bus" size={active ? 16 : 13} color={active ? colors.onMint : '#fff'} />
            </View>
          </Pressable>
        );
      })}

      <View style={[styles.pinWrap, me]} pointerEvents="none">
        <View style={styles.halo} />
        <View style={styles.me} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', backgroundColor: '#0f1c1b' },
  pinWrap: { position: 'absolute', transform: [{ translateX: '-50%' }, { translateY: '-50%' }], alignItems: 'center', justifyContent: 'center' },
  pin: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.blue,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinActive: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.mint },
  me: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#3B82F6', borderWidth: 3, borderColor: '#fff' },
  halo: { position: 'absolute', width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(59,130,246,0.2)' },
});
