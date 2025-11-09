'use client';

import { useEffect, useRef, useState } from 'react';

export function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      // Dynamically import Vanta and Three.js
      import('vanta/dist/vanta.net.min.js').then((VANTA) => {
        import('three').then((THREE) => {
          setVantaEffect(
            VANTA.default({
              el: vantaRef.current,
              THREE,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.0,
              minWidth: 200.0,
              scale: 1.0,
              scaleMobile: 1.0,
              color: 0x3b82f6, // Blue
              backgroundColor: 0x0a0a0a, // Dark background
              points: 10.0,
              maxDistance: 25.0,
              spacing: 18.0,
            })
          );
        });
      });
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 -z-10"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
