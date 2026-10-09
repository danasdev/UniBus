// Google Maps (Android) dark style tuned to the UniBus palette. iOS uses userInterfaceStyle="dark".
export const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0f1c1b' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#7f9a94' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0b1514' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1c2d2b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#132220' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#23403b' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2a5a51' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#06222b' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#0d2420' }] },
];
