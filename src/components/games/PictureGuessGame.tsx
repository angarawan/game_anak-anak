import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Star,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { Mascot, PictureGuessItem, UserProgress } from '../../types/game';
import { PICTURE_GUESS_ITEMS } from '../../data/learningData';
import { soundManager } from '../../utils/audio';
import { MascotCompanion } from '../MascotCompanion';

interface PictureGuessGameProps {
  activeMascot: Mascot;
  progress: UserProgress;
  onEarnReward: (stars: number, coins: number) => void;
  onBackToMenu: () => void;
}

type CategoryFilter = 'semua' | 'hewan' | 'buah' | 'rumah' | 'sekolah';

export const PictureGuessGame: React.FC<PictureGuessGameProps> = ({
  activeMascot,
  progress,
  onEarnReward,
  onBackToMenu,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('semua');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mascotSpeech, setMascotSpeech] = useState<string>(
    'Lihat gambar di bawah ini, lalu pilih tulisan kata yang tepat ya!'
  );

  const filteredItems = PICTURE_GUESS_ITEMS.filter((item) => {
    if (activeCategory === 'semua') return true;
    return item.category === activeCategory;
  });

  const currentItem: PictureGuessItem = filteredItems[currentIndex] || PICTURE_GUESS_ITEMS[0];

  useEffect(() => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    const speech = `Gambar apakah ini? Kategori ${currentItem.categoryLabel}!`;
    setMascotSpeech(speech);
    soundManager.speak(speech);
  }, [currentIndex, activeCategory]);

  const handleSelectOption = (option: string) => {
    if (isCorrect) return; // already solved
    soundManager.playPop();
    setSelectedAnswer(option);

    if (option === currentItem.correctWord) {
      soundManager.playCorrect();
      setIsCorrect(true);
      const praises = activeMascot.praisePhrases;
      const praise = praises[Math.floor(Math.random() * praises.length)];
      const speech = `${praise}! Benar sekali, ini adalah ${currentItem.correctWord}!`;
      setMascotSpeech(speech);
      soundManager.speak(speech);
      onEarnReward(1, 3);
    } else {
      soundManager.playEncourage();
      setIsCorrect(false);
      const encourages = activeMascot.encouragePhrases;
      const encourage = encourages[Math.floor(Math.random() * encourages.length)];
      const speech = `${encourage} ${currentItem.hint}`;
      setMascotSpeech(speech);
      soundManager.speak(`Ayo coba lagi! ${currentItem.hint}`);
    }
  };

  const handleNextItem = () => {
    soundManager.playPop();
    const nextIdx = (currentIndex + 1) % filteredItems.length;
    setCurrentIndex(nextIdx);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => {
            soundManager.playPop();
            onBackToMenu();
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Menu</span>
        </button>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {(
            [
              { id: 'semua', label: 'Semua Kategori' },
              { id: 'hewan', label: '🦁 Hewan' },
              { id: 'buah', label: '🍎 Buah' },
              { id: 'rumah', label: '🏠 Rumah' },
              { id: 'sekolah', label: '🎒 Sekolah' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playPop();
                setActiveCategory(cat.id);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mascot Companion Speaking */}
      <MascotCompanion mascot={activeMascot} speechText={mascotSpeech} />

      {/* Main Guess Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-200 shadow-md max-w-xl mx-auto text-center">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            Kategori: {currentItem.categoryLabel}
          </span>
          <span className="text-xs font-bold text-slate-400">
            Soal {currentIndex + 1} dari {filteredItems.length}
          </span>
        </div>

        {/* Picture Box */}
        <div className="relative w-44 h-44 mx-auto rounded-3xl bg-gradient-to-tr from-purple-100 to-pink-100 border-4 border-purple-200 flex items-center justify-center shadow-inner my-3">
          <span className="text-8xl select-none filter drop-shadow-md">
            {currentItem.imageUrl}
          </span>

          <button
            onClick={() => {
              soundManager.playPop();
              soundManager.speak(currentItem.hint);
            }}
            className="absolute bottom-2 right-2 p-2 rounded-xl bg-white/90 shadow-xs hover:bg-white text-purple-600 cursor-pointer"
            title="Dengarkan Petunjuk"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-xl font-black text-slate-800 mt-2 mb-1">
          Tulisan manakah yang sesuai dengan gambar di atas?
        </h3>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          {currentItem.hint}
        </p>

        {/* Options Grid */}
        <div className="space-y-3 max-w-md mx-auto">
          {currentItem.options.map((option) => {
            const isPicked = selectedAnswer === option;
            const isThisCorrect = isCorrect && option === currentItem.correctWord;
            const isThisWrong = isPicked && isCorrect === false;

            return (
              <button
                key={option}
                onClick={() => handleSelectOption(option)}
                className={`w-full py-4 px-6 rounded-2xl font-black text-xl tracking-wider transition-all cursor-pointer flex items-center justify-between shadow-xs ${
                  isThisCorrect
                    ? 'bg-emerald-500 text-white shadow-md scale-102 border-2 border-emerald-600'
                    : isThisWrong
                    ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                    : 'bg-slate-50 hover:bg-purple-50 text-slate-800 border-2 border-slate-200 hover:border-purple-300'
                }`}
              >
                <span>{option}</span>
                {isThisCorrect && (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                )}
                {isThisWrong && (
                  <span className="text-xs font-bold text-amber-700">
                    Coba Lagi Ya!
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              soundManager.playPop();
              soundManager.speak(currentItem.correctWord);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Sebutkan Nama Gambar</span>
          </button>

          <button
            onClick={handleNextItem}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-xs cursor-pointer transition-all"
          >
            <span>Gambar Selanjutnya</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
