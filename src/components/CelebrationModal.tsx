import React, { useEffect } from 'react';
import { Star, Coins, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface CelebrationModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  starsGained?: number;
  coinsGained?: number;
  onNext: () => void;
  onRetry?: () => void;
  nextLabel?: string;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  title = 'Hebat Sekali!',
  message = 'Kamu berhasil menyelesaikan latihan ini dengan sangat pintar!',
  starsGained = 1,
  coinsGained = 5,
  onNext,
  onRetry,
  nextLabel = 'Lanjut Bermain!',
}) => {
  useEffect(() => {
    if (isOpen) {
      soundManager.playFanfare();
      soundManager.speak(title + '! ' + message);
    }
  }, [isOpen, title, message]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border-4 border-amber-300">
        {/* Floating Celebration Badges */}
        <div className="w-20 h-20 mx-auto -mt-16 sm:-mt-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-white shadow-lg flex items-center justify-center">
          <Star className="w-12 h-12 text-white fill-amber-100 animate-bounce" />
        </div>

        <div className="mt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Prestasi Membanggakan!</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {title}
          </h2>

          <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
            {message}
          </p>

          {/* Rewards received banner */}
          <div className="mt-6 flex items-center justify-center gap-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
              <span className="font-extrabold text-lg text-amber-900 font-mono">
                +{starsGained} Bintang
              </span>
            </div>
            <div className="w-px h-6 bg-amber-300" />
            <div className="flex items-center gap-2">
              <Coins className="w-6 h-6 text-yellow-600" />
              <span className="font-extrabold text-lg text-yellow-900 font-mono">
                +{coinsGained} Koin
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {onRetry && (
              <button
                onClick={() => {
                  soundManager.playPop();
                  onRetry();
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Lagi</span>
              </button>
            )}

            <button
              onClick={() => {
                soundManager.playPop();
                onNext();
              }}
              className="flex-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{nextLabel}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
