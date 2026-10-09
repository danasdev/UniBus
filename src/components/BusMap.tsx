import Ionicons from '@expo/vector-icons/Ionicons';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Stop, userLocation } from '@/data/mock';
import { colors } from '@/theme';
import { darkMapStyle } from './mapStyle';

export type BusMapHandle = { recenter: () => void; focus: (stop: Stop) => void };

type Props = {
  stops: Stop[];
  selectedId?: string;
  onSelectStop?: (stop: Stop) => void;
  interactive?: boolean;
  style?: StyleProp<ViewStyle>;
};

const DELTA = { latitudeDelta: 0.009, longitudeDelta: 0.009 };

export const BusMap = forwardRef<BusMapHandle, Props>(function BusMap(
  { stops, selectedId, onSelectStop, interactive = true, style },
  ref,
) {
  const map = useRef<MapView>(null);

  useImperativeHandle(ref, () => ({
    recenter: () => map.current?.animateToRegion({ ...userLocation, ...DELTA }, 450),
    focus: (s) =>
      map.current?.animateToRegion({ latitude: s.latitude - 0.0012, longitude: s.longitude, latitudeDelta: 0.006, longitudeDelta: 0.006 }, 450),
  }));

  return (
    <View style={[styles.wrap, style]}>
      <MapView
        ref={map}
        style={StyleSheet.absoluteFill}
        initialRegion={{ ...userLocation, ...DELTA }}
        customMapStyle={darkMapStyle}
        userInterfaceStyle="dark"
        showsUserLocation
        showsCompass={false}
        showsPointsOfInterests={false}
        toolbarEnabled={false}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {stops.map((s) => {
          const active = s.id === selectedId;
          return (
            <Marker
              key={s.id}
              coordinate={{ latitude: s.latitude, longitude: s.longitude }}
              onPress={() => onSelectStop?.(s)}
              tracksViewChanges={false}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={[styles.pin, active && styles.pinActive]}>
                <Ionicons name="bus" size={active ? 16 : 13} color={active ? colors.onMint : '#fff'} />
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', backgroundColor: '#0E1A1A' },
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
});
