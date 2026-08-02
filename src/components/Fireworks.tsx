import React from 'react';
import { motion } from 'motion/react';

export default function Fireworks() {
  const particles = Array.from({ length: 20 });
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1.5, 0],
            x: (Math.random() - 0.5) * 500,
            y: (Math.random() - 0.5) * 500,
            opacity: [1, 0],
          }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className={`absolute w-3 h-3 rounded-full ${['bg-orange-500', 'bg-white', 'bg-green-600'][i % 3]}`}
        />
      ))}
    </div>
  );
}
