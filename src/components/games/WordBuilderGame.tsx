import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  Volume2,
  Star,
} from 'lucide-react';
import { Mascot, WordBuilderItem, UserProgress } from '../../types/game';
import { WORD_BUILDER_ITEMS } from '../../data/learningData';
import { soundManager } from '../../utils/audio';
import { MascotCompanion } from '../MascotCompanion';

interface WordBuilderGameProps {
  activeMascot: Mascot;
  progress: UserProgress;
  onEarnReward: (stars: number, coins: number) => void;
  onBackToMenu: () => void;
}

type LengthFilter = 'all' | 3 | 4 | 6;

export const WordBuilderGame: React.FC<WordBuilderGameProps> = ({
  activeMascot,
  progress,
  onEarnReward,
  onBackToMenu,
}) => {
  const [lengthFilter, setLengthFilter] = useState<LengthFilter>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Available letter tiles and placed slots
  const [availableLetters, setAvailableLetters] = useState<{ id: string; letter: string }[]>([]);
  const [placedSlots, setPlacedSlots] = useState<{ id: string; letter: string }[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [mascotSpeech, setMascotSpeech] = useState<string>(
    'Sentuh huruf-huruf warna-warni untuk menyusun kata yang tepat ya!'
  );

  const filteredWords = WORD_BUILDER_ITEMS.filter((item) => {
    if (lengthFilter === 'all') return true;
    return item.length === lengthFilter;
  });

  const currentItem: WordBuilderItem = filteredWords[currentIndex] || WORD_BUILDER_ITEMS[0];

  // Initialize round
  useEffect(() => {
    initRound(currentItem);
  }, [currentIndex, lengthFilter]);

  const initRound = (item: WordBuilderItem) => {
    // Generate scrambled letter objects with unique keys
    const letterObjects = item.letters.map((letter, idx) => ({
      id: `${letter}-${idx}-${Date.now()}`,
      letter,
    }));
    setAvailableLetters(letterObjects);
    setPlacedSlots([]);
    setIsSolved(false);

    const speech = `Ayo susun kata ${item.word}! ${item.displayHint}`;
    setMascotSpeech(speech);
    soundManager.speak(speech);
  };

  const handlePickLetter = (letterObj: { id: string; letter: string }) => {
    if (isSolved) return;
    soundManager.playPop();
    soundManager.speak(letterObj.letter);

    const newPlaced = [...placedSlots, letterObj];
    const newAvailable = availableLetters.filter((l) => l.id !== letterObj.id);

    setPlacedSlots(newPlaced);
    setAvailableLetters(newAvailable);

    // Check if fully placed
    if (newPlaced.length === currentItem.word.length) {
      const currentBuiltWord = newPlaced.map((p) => p.letter).join('');
      if (currentBuiltWord === currentItem.word) {
        soundManager.playCorrect();
        setIsSolved(true);
        const praises = activeMascot.praisePhrases;
        const praise = praises[Math.floor(Math.random() * praises.length)];
        const speech = `${praise}! Kata ${currentItem.word} berhasil tersusun sempurna!`;
        setMascotSpeech(speech);
        soundManager.speak(speech);
        onEarnReward(1, 3);
      } else {
        soundManager.playEncourage();
        setMascotSpeech('Hampir benar! Yuk coba atur ulang hurufnya!');
        soundManager.speak('Hampir benar! Yuk coba atur ulang hurufnya!');
      }
    }
  };

  const handleRemovePlacedLetter = (indexToRemove: number) => {
    if (isSolved) return;
    soundManager.playPop();
    const removedItem = placedSlots[indexToRemove];
    const newPlaced = placedSlots.filter((_, idx) => idx !== indexToRemove);

    setPlacedSlots(newPlaced);
    setAvailableLetters([...availableLetters, removedItem]);
  };

  const handleUseHint = () => {
    if (isSolved) return;
    soundManager.playPop();

    // Find the next correct letter needed in sequence
    const nextTargetIndex = placedSlots.length;
    if (nextTargetIndex < currentItem.word.length) {
      const neededLetter = currentItem.word[nextTargetIndex];
      const foundInAvailable = availableLetters.find((l) => l.letter === neededLetter);

      if (foundInAvailable) {
        handlePickLetter(foundInAvailable);
        soundManager.speak(`Petunjuk: huruf ${neededLetter}!`);
      } else {
        // If wrong letter already placed earlier, reset and place correct
        initRound(currentItem);
      }
    }
  };

  const handleNextWord = () => {
    soundManager.playPop();
    const nextIdx = (currentIndex + 1) % filteredWords.length;
    setCurrentIndex(nextIdx);
  };

  const handleReset = () => {
    soundManager.playPop();
    initRound(currentItem);
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

        {/* Filter Length Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              soundManager.playPop();
              setLengthFilter('all');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
              lengthFilter === 'all'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Kata
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setLengthFilter(3);
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
              lengthFilter === 3
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3 Huruf
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setLengthFilter(4);
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
              lengthFilter === 4
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4 Huruf
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setLengthFilter(6);
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
              lengthFilter === 6
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            5–6 Huruf
          </button>
        </div>
      </div>

      {/* Mascot Companion Speaking */}
      <MascotCompanion mascot={activeMascot} speechText={mascotSpeech} />

      {/* Main Word Builder Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-orange-200 shadow-md max-w-xl mx-auto text-center">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
            Kategori: {currentItem.category}
          </span>
          <button
            onClick={handleUseHint}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-extrabold cursor-pointer transition-colors shadow-xs"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>Petunjuk 💡</span>
          </button>
        </div>

        {/* Picture Icon */}
        <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-tr from-amber-100 to-orange-100 border-4 border-orange-200 flex items-center justify-center shadow-inner my-2">
          <span className="text-6xl drop-shadow-sm select-none">
            {currentItem.icon}
          </span>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-slate-600 my-2">
          {currentItem.displayHint}
        </p>

        {/* Word Target Slots */}
        <div className="my-6">
          <span className="text-xs font-bold text-slate-400 block mb-2">
            Kotak Kata ({placedSlots.length}/{currentItem.length} Huruf)
          </span>

          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {Array.from({ length: currentItem.length }).map((_, slotIdx) => {
              const placed = placedSlots[slotIdx];
              return (
                <button
                  key={slotIdx}
                  onClick={() => placed && handleRemovePlacedLetter(slotIdx)}
                  className={`w-14 h-16 sm:w-16 sm:h-20 rounded-2xl border-3 flex items-center justify-center text-3xl sm:text-4xl font-black transition-all ${
                    placed
                      ? isSolved
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105'
                        : 'bg-orange-500 text-white border-orange-600 shadow-sm hover:bg-orange-600 cursor-pointer'
                      : 'bg-slate-50 border-dashed border-slate-300 text-slate-300'
                  }`}
                  title={placed ? 'Sentuh untuk mengembalikan huruf' : undefined}
                >
                  {placed ? placed.letter : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Available Scrambled Letter Tiles */}
        <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 my-4">
          <span className="text-xs font-bold text-orange-800 block mb-2.5">
            Pilih huruf di bawah untuk dimasukkan ke kotak:
          </span>

          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap min-h-16">
            {availableLetters.length > 0 ? (
              availableLetters.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handlePickLetter(l)}
                  className="w-13 h-15 sm:w-15 sm:h-17 rounded-2xl bg-white hover:bg-amber-100 text-slate-800 border-2 border-amber-300 shadow-sm hover:shadow-md font-black text-2xl sm:text-3xl transition-all transform hover:-translate-y-1 active:scale-95 cursor-pointer flex items-center justify-center"
                >
                  {l.letter}
                </button>
              ))
            ) : (
              <span className="text-xs font-semibold text-slate-400 self-center">
                Semua huruf sudah diletakkan!
              </span>
            )}
          </div>
        </div>

        {/* Success Banner */}
        {isSolved && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in fade-in my-3">
            <span className="text-sm font-black text-emerald-800 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Hebat! Kata &ldquo;{currentItem.word}&rdquo; tersusun benar!</span>
            </span>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mulai Ulang Kata</span>
          </button>

          <button
            onClick={handleNextWord}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-xs cursor-pointer transition-all"
          >
            <span>Kata Berikutnya</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
