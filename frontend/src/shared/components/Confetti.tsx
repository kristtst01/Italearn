import { useEffect } from 'react';
import confetti from 'canvas-confetti';

/**
 * Brief confetti burst animation. Fires on mount, no DOM elements.
 */
export default function Confetti() {
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return null;
}
