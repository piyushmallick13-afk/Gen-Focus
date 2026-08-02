import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Fireworks from './Fireworks';

export default function IndependenceDayEasterEgg({ onClose }: { onClose: () => void }) {
  const [showFireworks, setShowFireworks] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowFireworks(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white p-10 rounded-3xl shadow-2xl text-center border-4 border-orange-500"
        >
          <h2 className="text-4xl font-display font-bold text-green-700 mb-4">Happy Independence Day!</h2>
          <p className="text-xl text-slate-600">Celebrating the spirit of freedom.</p>
        </motion.div>
        {showFireworks && <Fireworks />}
      </motion.div>
    </AnimatePresence>
  );
}
