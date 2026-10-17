import React from 'react';
import { Coffee, Eye, Sparkles, Check } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface BreakTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  minutesSpent: number;
}

export const BreakTimeModal: React.FC<BreakTimeModalProps> = ({
  isOpen,
  onClose,
  minutesSpent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 text-center shadow-2xl border-4 border-sky-300">
        <div className="w-16 h-16 mx-auto rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
          <Coffee className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-xs font-bold mb-2">
          <Sparkles className="w-4 h-4 text-sky-500" />
          <span>Istirahat Mata &amp; Tubuh Sejenak</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800">
          Waktunya Beristirahat!
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          Kamu sudah belajar seru selama <span className="font-bold text-sky-700">{minutesSpent} menit</span>. Supaya mata tetap sehat dan bertenaga, yuk lakukan aktivitas menyenangkan ini:
        </p>

        <div className="mt-4 space-y-2.5 text-left">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-sky-50/70 border border-sky-100">
            <span className="text-xl">💧</span>
            <div className="text-xs sm:text-sm text-slate-700 font-medium">
              Minum segelas air putih segar
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <Eye className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs sm:text-sm text-slate-700 font-medium">
              Lihat pemandangan hijau di luar jendela selama 20 detik
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/70 border border-amber-100">
            <span className="text-xl">🙆</span>
            <div className="text-xs sm:text-sm text-slate-700 font-medium">
              Rengangkan kedua tangan ke atas dan tersenyum gembira
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playPop();
            onClose();
          }}
          className="mt-6 w-full py-3 px-6 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>Sudah Segar, Lanjut Belajar!</span>
        </button>
      </div>
    </div>
  );
};
