import React from 'react';
import { Volume2, Heart } from 'lucide-react';
import { Mascot } from '../types/game';
import { soundManager } from '../utils/audio';

interface MascotCompanionProps {
  mascot: Mascot;
  speechText?: string;
  accessoryIcon?: string;
  onSpeak?: () => void;
  compact?: boolean;
}

export const MascotCompanion: React.FC<MascotCompanionProps> = ({
  mascot,
  speechText,
  accessoryIcon,
  onSpeak,
  compact = false,
}) => {
  const currentSpeech = speechText || mascot.greeting;

  const handleSpeak = () => {
    soundManager.playPop();
    soundManager.speak(currentSpeech);
    if (onSpeak) onSpeak();
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xs p-2.5 rounded-2xl border border-emerald-100 shadow-xs">
        <div className="relative w-12 h-12 shrink-0">
          <img
            src={mascot.image}
            alt={mascot.name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-xl object-cover border-2 border-amber-300 shadow-xs"
          />
          {accessoryIcon && (
            <span className="absolute -top-2 -right-2 text-base drop-shadow-sm">
              {accessoryIcon}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-slate-800">{mascot.name}</span>
            <button
              onClick={handleSpeak}
              className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 cursor-pointer"
              title="Dengarkan suara"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-600 truncate">{currentSpeech}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col sm:flex-row items-center gap-4 bg-white/95 rounded-3xl p-4 sm:p-5 border-2 border-emerald-200/80 shadow-md">
      {/* Mascot Avatar with Accessory */}
      <div className="relative group shrink-0">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-3 border-amber-300 shadow-sm bg-gradient-to-tr from-amber-100 to-emerald-100 flex items-center justify-center">
          <img
            src={mascot.image}
            alt={mascot.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
          />
        </div>

        {accessoryIcon && (
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow-md border border-amber-200 flex items-center justify-center text-lg animate-bounce">
            {accessoryIcon}
          </div>
        )}

        <div className="absolute -bottom-2 inset-x-0 flex justify-center">
          <span className="bg-emerald-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
            {mascot.name}
          </span>
        </div>
      </div>

      {/* Cheerful Speech Bubble */}
      <div className="flex-1 text-center sm:text-left relative">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs mb-1.5 border border-emerald-100">
          <Heart className="w-3 h-3 fill-rose-400 text-rose-500" />
          <span>Teman Belajarmu</span>
        </div>

        <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
          &ldquo;{currentSpeech}&rdquo;
        </p>

        {/* Listen Again button */}
        <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-2">
          <button
            onClick={handleSpeak}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            <Volume2 className="w-4 h-4" />
            <span>Dengarkan Teman 🔊</span>
          </button>
        </div>
      </div>
    </div>
  );
};
