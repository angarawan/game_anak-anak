import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Mascot, SyllableGroup, UserProgress } from '../../types/game';
import { SYLLABLES_GROUPS } from '../../data/learningData';
import { soundManager } from '../../utils/audio';
import { MascotCompanion } from '../MascotCompanion';

interface SyllablesGameProps {
  activeMascot: Mascot;
  progress: UserProgress;
  onEarnReward: (stars: number, coins: number, syllable?: string) => void;
  onBackToMenu: () => void;
}

export const SyllablesGame: React.FC<SyllablesGameProps> = ({
  activeMascot,
  progress,
  onEarnReward,
  onBackToMenu,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<SyllableGroup>(SYLLABLES_GROUPS[0]);
  const [activeSyllable, setActiveSyllable] = useState<string>('BA');

  // Word combination practice state
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(0);
  const [builtParts, setBuiltParts] = useState<string[]>([]);
  const [wordCompleted, setWordCompleted] = useState<boolean>(false);
  const [mascotSpeech, setMascotSpeech] = useState<string>(
    'Sentuh suku kata BA, BI, BU, BE, BO untuk mendengarkan pelafalannya ya!'
  );

  const currentExampleWord = selectedGroup.exampleWords[selectedWordIndex];

  const handleSelectSyllable = (syl: string) => {
    soundManager.playPop();
    setActiveSyllable(syl);
    const speech = `${syl}! Dilafalkan: ${syl}!`;
    setMascotSpeech(speech);
    soundManager.speak(syl);
    onEarnReward(0, 1, syl);
  };

  const handleTouchWordPart = (part: string) => {
    soundManager.playPop();
    soundManager.speak(part);

    const nextParts = [...builtParts, part];
    setBuiltParts(nextParts);

    // Check if word completed
    if (nextParts.length === currentExampleWord.parts.length) {
      soundManager.playCorrect();
      setWordCompleted(true);
      const fullWord = currentExampleWord.word;
      const speech = `${currentExampleWord.parts.join(' - ')} dibaca ${fullWord}! Artinya: ${currentExampleWord.meaning}!`;
      setMascotSpeech(`Pintar sekali! ${speech}`);
      soundManager.speak(speech);
      onEarnReward(1, 3);
    }
  };

  const handleNextExampleWord = () => {
    soundManager.playPop();
    const nextIdx = (selectedWordIndex + 1) % selectedGroup.exampleWords.length;
    setSelectedWordIndex(nextIdx);
    setBuiltParts([]);
    setWordCompleted(false);
  };

  const handleResetCurrentWord = () => {
    soundManager.playPop();
    setBuiltParts([]);
    setWordCompleted(false);
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

        {/* Consonant Selector Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
          {SYLLABLES_GROUPS.map((grp) => (
            <button
              key={grp.consonant}
              onClick={() => {
                soundManager.playPop();
                setSelectedGroup(grp);
                setActiveSyllable(grp.items[0]);
                setSelectedWordIndex(0);
                setBuiltParts([]);
                setWordCompleted(false);
                const speech = `Kelompok suku kata huruf ${grp.consonant}!`;
                setMascotSpeech(speech);
                soundManager.speak(speech);
              }}
              className={`w-9 h-9 rounded-xl font-black text-sm transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                selectedGroup.consonant === grp.consonant
                  ? 'bg-amber-500 text-white shadow-xs scale-105'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {grp.consonant}
            </button>
          ))}
        </div>
      </div>

      {/* Mascot Companion Speaking */}
      <MascotCompanion mascot={activeMascot} speechText={mascotSpeech} />

      {/* Main Play Area: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Syllables Family (BA, BI, BU, BE, BO) */}
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                Keluarga Suku Kata
              </span>
              <h3 className="text-xl font-black text-slate-800">
                Kelompok {selectedGroup.consonant}
              </h3>
            </div>
            <button
              onClick={() => {
                soundManager.playPop();
                const allText = selectedGroup.items.join(', ');
                soundManager.speak(allText);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold cursor-pointer transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Dengar Semua 🔊</span>
            </button>
          </div>

          {/* Big 5 Syllable Buttons */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3 my-4">
            {selectedGroup.items.map((syl) => {
              const isSelected = activeSyllable === syl;
              const isLearned = progress.syllablesLearned?.includes(syl);

              return (
                <button
                  key={syl}
                  onClick={() => handleSelectSyllable(syl)}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all cursor-pointer font-black ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-md scale-105 ring-4 ring-amber-200'
                      : isLearned
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-200'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-2 border-slate-200'
                  }`}
                >
                  <span className="text-xl sm:text-2xl">{syl}</span>
                  <span className="text-[10px] font-medium opacity-80">
                    {syl.toLowerCase()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Syllable Detailed Focus */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 font-black text-2xl flex items-center justify-center shadow-xs">
                {activeSyllable}
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-700">
                  Suku Kata Aktif
                </span>
                <div className="text-base font-extrabold text-slate-800">
                  Bunyi: &ldquo;{activeSyllable}&rdquo;
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playPop();
                soundManager.speak(activeSyllable);
              }}
              className="p-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-xs active:scale-95 transition-all"
              title="Bunyikan Suku Kata"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Word Merger (BA + JU = BAJU) */}
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                  Gabung Suku Kata
                </span>
                <h3 className="text-xl font-black text-slate-800">
                  Latihan Membaca Kata
                </h3>
              </div>
              <span className="text-2xl">{currentExampleWord.icon}</span>
            </div>

            {/* Word Target Box */}
            <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center">
              <span className="text-xs font-bold text-emerald-700 block mb-1">
                Sentuh suku kata secara berurutan:
              </span>

              {/* Syllable Slots */}
              <div className="flex items-center justify-center gap-3 my-3">
                {currentExampleWord.parts.map((expectedPart, idx) => {
                  const filledPart = builtParts[idx];
                  return (
                    <React.Fragment key={idx}>
                      <div
                        className={`w-20 h-16 rounded-2xl border-2 flex items-center justify-center font-black text-2xl transition-all ${
                          filledPart
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm scale-105'
                            : 'bg-white border-dashed border-emerald-300 text-emerald-400'
                        }`}
                      >
                        {filledPart || expectedPart}
                      </div>
                      {idx < currentExampleWord.parts.length - 1 && (
                        <Plus className="w-5 h-5 text-emerald-400" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Full Word Display when finished */}
              {wordCompleted ? (
                <div className="mt-3 p-3 rounded-xl bg-white border border-emerald-300 animate-in fade-in">
                  <div className="text-3xl font-black text-emerald-700">
                    {currentExampleWord.word}
                  </div>
                  <div className="text-xs font-semibold text-slate-600 mt-1">
                    {currentExampleWord.meaning}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-1">
                  Petunjuk: Tekan tombol suku kata di bawah untuk menyusun kata!
                </p>
              )}
            </div>

            {/* Tap-to-build options */}
            <div className="mt-4 flex items-center justify-center gap-3">
              {currentExampleWord.parts.map((part, i) => (
                <button
                  key={i}
                  onClick={() => handleTouchWordPart(part)}
                  className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  {part}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={handleResetCurrentWord}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Coba Lagi</span>
            </button>

            <button
              onClick={handleNextExampleWord}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>Kata Selanjutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
