import qrcode from 'qrcode-generator';
import { useMemo } from 'react';
import Svg, { Path } from 'react-native-svg';

/** Renders a QR code as a single SVG path (crisp at any size). */
export function QRCode({ value, size = 220, color = '#03231C' }: { value: string; size?: number; color?: string }) {
  const { d, count } = useMemo(() => {
    const qr = qrcode(0, 'M');
    qr.addData(value);
    qr.make();
    const n = qr.getModuleCount();
    let path = '';
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.isDark(r, c)) path += `M${c} ${r}h1v1h-1z`;
      }
    }
    return { d: path, count: n };
  }, [value]);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${count} ${count}`}>
      <Path d={d} fill={color} />
    </Svg>
  );
}
