import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const TOKEN_COLORS = ['--color-vermiglione', '--color-ocra', '--color-cobalto', '--color-verde'];

/** Brief confetti burst in the palette's colours. Reserved for earning a stamp. */
export default function Confetti() {
  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: TOKEN_COLORS.map((v) => style.getPropertyValue(v).trim()).filter(Boolean),
    });
  }, []);

  return null;
}
