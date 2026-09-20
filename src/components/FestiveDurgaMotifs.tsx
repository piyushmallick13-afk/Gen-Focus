import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';

/* Maa Durga Trinayani (Three Eyes of Durga with Third Eye Bindi & Tilak) */
export function DurgaTrinayani({ className = "w-8 h-8", color = "#B91C1C", accentColor = "#D97706" }: { className?: string; color?: string; accentColor?: string }) {
  return (
    <svg viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Maa Durga Trinayani Motif">
      {/* Left Eye */}
      <path 
        d="M10 38C22 24 38 24 50 38C38 46 22 46 10 38Z" 
        stroke={color} 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="#FFFFFF"
      />
      <ellipse cx="30" cy="36" rx="7" ry="7" fill={color} />
      <circle cx="32" cy="34" r="2.2" fill="#FFFFFF" />
      {/* Left Eyebrow curved */}
      <path d="M12 28C22 17 38 17 50 25" stroke={color} strokeWidth="3.5" strokeLinecap="round" />

      {/* Right Eye */}
      <path 
        d="M70 38C82 24 98 24 110 38C98 46 82 46 70 38Z" 
        stroke={color} 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="#FFFFFF"
      />
      <ellipse cx="90" cy="36" rx="7" ry="7" fill={color} />
      <circle cx="92" cy="34" r="2.2" fill="#FFFFFF" />
      {/* Right Eyebrow curved */}
      <path d="M70 25C82 17 98 17 108 28" stroke={color} strokeWidth="3.5" strokeLinecap="round" />

      {/* Third Eye (Agni Netra / Trinayana on Forehead) */}
      <path 
        d="M60 12C55 23 55 33 60 44C65 33 65 23 60 12Z" 
        fill={color} 
        stroke={accentColor} 
        strokeWidth="1.5"
      />
      <circle cx="60" cy="28" r="2.5" fill={accentColor} />

      {/* Chandrabindu / Tilak Art above Third Eye */}
      <path d="M54 7C58 4 62 4 66 7" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="2" r="1.8" fill={color} />

      {/* Nose ring / Nath hint */}
      <circle cx="53" cy="55" r="4.5" stroke={accentColor} strokeWidth="2" fill="none" />
      <circle cx="53" cy="59.5" r="1.5" fill={color} />
    </svg>
  );
}

/* Authentic Bengali Dhak (Festival Drum) with Kash Phool plume */
export function DhakIcon({ className = "w-6 h-6", color = "#B91C1C" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Dhak Drum Body */}
      <ellipse cx="28" cy="36" rx="14" ry="20" transform="rotate(-15 28 36)" fill="#854D0E" stroke={color} strokeWidth="2" />
      <ellipse cx="28" cy="36" rx="11" ry="18" transform="rotate(-15 28 36)" fill="#FEF08A" />
      {/* Drum straps (Tension Ropes) */}
      <path d="M18 20L34 50M24 16L40 46M14 26L30 56" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      {/* Feather plume (Kash Phool / Shola feather decoration on dhak) */}
      <path d="M38 22C46 16 54 10 58 4C54 12 50 18 42 26" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M42 20C50 16 56 12 60 8" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
      <path d="M36 28C44 24 50 20 54 16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      {/* Drum sticks (Kathi) */}
      <line x1="10" y1="44" x2="26" y2="34" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="8" y1="36" x2="24" y2="38" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* Traditional Bengali Dhunuchi (Incense Burner) with aromatic smoke */
export function DhunuchiIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Dhunuchi Bowl (Clay terracotta) */}
      <path d="M16 26C16 26 18 40 32 40C46 40 48 26 48 26L52 23H12L16 26Z" fill="#B45309" stroke="#78350F" strokeWidth="2" />
      <ellipse cx="32" cy="23" rx="20" ry="4" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
      {/* Stem / Handle */}
      <path d="M30 40V52C30 53 28 56 22 58H42C36 56 34 53 34 52V40" fill="#92400E" stroke="#78350F" strokeWidth="1.5" />
      {/* Incense coconut husk charcoal & fire glow */}
      <ellipse cx="32" cy="22" rx="14" ry="2.5" fill="#DC2626" />
      {/* Curling Dhunuchi aromatic smoke */}
      <path d="M28 18C26 13 32 10 30 5C29 3 31 1 33 0" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 3" />
      <path d="M34 19C37 15 34 11 37 7C39 4 41 2 40 1" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
      <path d="M31 16C33 13 31 9 34 6" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* Traditional Bengali Alpona Pattern Divider */
export function AlponaDivider({ className = "w-full my-6", color = "#B91C1C" }: { className?: string; color?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 overflow-hidden px-4 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-300 to-rose-600/30" />
      <svg width="140" height="24" viewBox="0 0 140 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-rose-700">
        <path d="M70 2L75 9L82 12L75 15L70 22L65 15L58 12L65 9L70 2Z" fill={color} />
        <circle cx="70" cy="12" r="3" fill="#FBBF24" />
        {/* Left spiral leaf / paisley */}
        <path d="M54 12C46 6 36 18 26 12C20 8 16 12 8 12" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="42" cy="12" r="2" fill="#B91C1C" />
        <circle cx="26" cy="12" r="1.5" fill="#D97706" />
        {/* Right spiral leaf / paisley */}
        <path d="M86 12C94 6 104 18 114 12C120 8 124 12 132 12" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="98" cy="12" r="2" fill="#B91C1C" />
        <circle cx="114" cy="12" r="1.5" fill="#D97706" />
      </svg>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-amber-300 to-rose-600/30" />
    </div>
  );
}

/* Interactive Bengali Dhak Rhythm Synth (No external audio file needed!) */
export function DhakBeatsController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  const playDhakHit = (ctx: AudioContext, frequency: number, decay: number, isAccent = false) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isAccent ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.35, ctx.currentTime + decay);

    // Initial punch
    gain.gain.setValueAtTime(isAccent ? 0.6 : 0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + decay);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + decay);
  };

  const playKathiClick = (ctx: AudioContext) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  };

  const toggleDhak = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      setIsPlaying(false);
    } else {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Authentic Bengali Dhak Bol: Dha-kuting, Dha-kuting, Dha-kuting, Tin-Ta (8 beat cycle)
      let step = 0;
      const tempoMs = 175; // Festive energetic tempo

      intervalRef.current = window.setInterval(() => {
        if (!ctx || ctx.state === 'closed') return;
        if (ctx.state === 'suspended') ctx.resume();

        switch (step % 16) {
          case 0:
            playDhakHit(ctx, 160, 0.28, true); // Dha (Heavy bass)
            break;
          case 2:
            playKathiClick(ctx); // ku
            break;
          case 3:
            playDhakHit(ctx, 240, 0.12, false); // ting
            break;
          case 4:
            playDhakHit(ctx, 170, 0.24, true); // Dha
            break;
          case 6:
            playKathiClick(ctx);
            break;
          case 7:
            playDhakHit(ctx, 250, 0.12, false);
            break;
          case 8:
            playDhakHit(ctx, 180, 0.25, true); // Dha
            break;
          case 10:
            playKathiClick(ctx);
            break;
          case 11:
            playDhakHit(ctx, 230, 0.12, false);
            break;
          case 12:
            playDhakHit(ctx, 290, 0.14, false); // Tin
            break;
          case 14:
            playDhakHit(ctx, 150, 0.3, true); // Taaa
            playKathiClick(ctx);
            break;
          default:
            break;
        }
        step++;
      }, tempoMs);

      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  return (
    <button
      onClick={toggleDhak}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border shadow-sm ${
        isPlaying
          ? 'bg-rose-600 text-white border-rose-700 shadow-rose-200 animate-pulse'
          : 'bg-amber-50 text-amber-900 border-amber-200/80 hover:bg-amber-100 hover:border-amber-300'
      }`}
      title={isPlaying ? "Mute Dhak Beats" : "Listen to traditional Durga Puja Dhak rhythm"}
    >
      <DhakIcon className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
      <span className="hidden sm:inline">
        {isPlaying ? 'Dhak Playing • ঢাক বাজছে' : 'Pujor Dhak Beats'}
      </span>
      <span className="sm:hidden">
        {isPlaying ? 'Mute Dhak' : 'Play Dhak'}
      </span>
      {isPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-stone-400" />}
    </button>
  );
}

/* 5 Days of Durga Puja Lookbook Guide Data */
export interface PujoDayInfo {
  day: string;
  bengaliName: string;
  englishTitle: string;
  dateTag: string;
  theme: string;
  ritual: string;
  styleAdvice: string;
  colorTone: string;
  recommendedCategory: string;
}

export const PUJO_DAYS: PujoDayInfo[] = [
  {
    day: 'Shasthi',
    bengaliName: 'মহা ষষ্ঠী',
    englishTitle: 'Maha Shasthi • Bodhon',
    dateTag: 'Day 1 of Pujo',
    theme: 'Warm welcome & Fresh Awakening',
    ritual: 'Kalparambho & Bodhon (Awakening of Maa Durga)',
    styleAdvice: 'Light morning cottons, fresh citrus fragrance, and handcrafted accessories.',
    colorTone: 'from-amber-500/20 to-orange-500/10',
    recommendedCategory: 'Living'
  },
  {
    day: 'Saptami',
    bengaliName: 'মহা সপ্তমী',
    englishTitle: 'Maha Saptami • Nabapatrika',
    dateTag: 'Day 2 of Pujo',
    theme: 'Nature & Sacred Traditions',
    ritual: 'Kola Bou Snan (Bathing of the sacred banana plant bride)',
    styleAdvice: 'Tant weave textiles, bright yellow/mustard touches, and brass ambient decor.',
    colorTone: 'from-yellow-500/20 to-amber-500/10',
    recommendedCategory: 'Home & Kitchen'
  },
  {
    day: 'Ashtami',
    bengaliName: 'মহা অষ্টমী',
    englishTitle: 'Maha Ashtami • Pushpanjali & Sandhi Puja',
    dateTag: 'Day 3 • Pinnacle Day',
    theme: 'Pure Royal Devotion & Sandhi Aarti',
    ritual: 'Morning Pushpanjali, 108 Lotuses & Clay Dhunuchi Naach',
    styleAdvice: 'Classic Gorod white & deep crimson red, rich sandalwood scents, fine jewelry.',
    colorTone: 'from-rose-600/25 to-red-700/15',
    recommendedCategory: 'Accessories'
  },
  {
    day: 'Nabami',
    bengaliName: 'মহা নবমী',
    englishTitle: 'Maha Nabami • Grand Aarti',
    dateTag: 'Day 4 of Pujo',
    theme: 'Grandeur, Celebration & Feasting',
    ritual: 'Maha Aarti, Bhog distribution, and late night Pandal hopping',
    styleAdvice: 'Opulent evening wear, comfortable footwear for pandal trails, and signature lamps.',
    colorTone: 'from-purple-600/20 to-rose-600/10',
    recommendedCategory: 'Home & Kitchen'
  },
  {
    day: 'Dashami',
    bengaliName: 'বিজয়া দশমী',
    englishTitle: 'Bijoya Dashami • Sindoor Khela',
    dateTag: 'Day 5 • Farewell & Blessings',
    theme: 'Sindoor Khela, Sweets & Shubho Bijoya',
    ritual: 'Visarjan, Sindoor Khela by married women, touching feet of elders',
    styleAdvice: 'Lal-Paar white attire, festive gift hampers, premium confection boxes.',
    colorTone: 'from-red-600/20 to-amber-600/15',
    recommendedCategory: 'Living'
  }
];

export function PujoDaysTabStrip({ 
  activeDay, 
  onSelectDay 
}: { 
  activeDay: string; 
  onSelectDay: (day: PujoDayInfo) => void;
}) {
  return (
    <div className="w-full bg-gradient-to-r from-amber-50/80 via-rose-50/60 to-amber-50/80 p-4 md:p-6 rounded-3xl border border-amber-200/60 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <DurgaTrinayani className="w-6 h-6 text-rose-700" color="#B91C1C" accentColor="#D97706" />
          <div>
            <h3 className="text-base md:text-lg font-display font-medium text-stone-900 flex items-center gap-2">
              <span>শারদোৎসব • 5 Days of Durga Puja</span>
              <span className="text-xs bg-rose-600 text-white font-sans px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                Festive Curation
              </span>
            </h3>
            <p className="text-xs text-stone-500 font-light">
              Explore handpicked lookbooks & rituals tailored for each auspicious day of Pujo
            </p>
          </div>
        </div>
        <DhakBeatsController />
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 md:gap-3">
        {PUJO_DAYS.map((pDay) => {
          const isSelected = activeDay === pDay.day;
          return (
            <button
              key={pDay.day}
              onClick={() => onSelectDay(pDay)}
              className={`p-3 rounded-2xl text-left transition-all duration-300 border relative overflow-hidden group ${
                isSelected
                  ? 'bg-white border-rose-600 shadow-md ring-2 ring-rose-600/20'
                  : 'bg-white/70 hover:bg-white border-stone-200/80 hover:border-amber-300'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
                  <div className="bg-rose-600 text-white text-[9px] font-bold uppercase py-0.5 px-4 transform rotate-45 translate-x-2 -translate-y-1 shadow-sm">
                    ✓
                  </div>
                </div>
              )}
              <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                {pDay.dateTag}
              </div>
              <div className="text-base font-display font-medium text-stone-900 group-hover:text-rose-700 transition-colors">
                {pDay.bengaliName}
              </div>
              <div className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                {pDay.day}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
