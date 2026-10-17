import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Star,
  Play,
} from 'lucide-react';
import { Mascot, ReadingSentence, UserProgress } from '../../types/game';
import { READING_SENTENCES } from '../../data/learningData';
import { soundManager } from '../../utils/audio';
import { MascotCompanion } from '../MascotCompanion';

interface ReadingGameProps {
  activeMascot: Mascot;
  progress: UserProgress;
  onEarnReward: (stars: number, coins: number) => void;
  onBackToMenu: () => void;
}

export const ReadingGame: React.FC<ReadingGameProps> = ({
  activeMascot,
  progress,
  onEarnReward,
  onBackToMenu,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(3);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const [mascotSpeech, setMascotSpeech] = useState<string>(
    'Sentuh tombol Dengarkan untuk membaca bersama-sama ya!'
  );

  // Level 1: Letters reading
  const level1Letters = [
    { char: 'A', name: 'A', example: 'Ayam', icon: '🐔' },
    { char: 'B', name: 'B', example: 'Bola', icon: '⚽' },
    { char: 'C', name: 'C', example: 'Ceri', icon: '🍒' },
    { char: 'D', name: 'D', example: 'Domba', icon: '🐑' },
    { char: 'I', name: 'I', example: 'Ikan', icon: '🐟' },
    { char: 'U', name: 'U', example: 'Udang', icon: '🦐' },
  ];
  const [level1Index, setLevel1Index] = useState<number>(0);

  // Level 2: Syllables reading
  const level2Syllables = [
    { part: 'BA', icon: '👕', meaning: 'Baju' },
    { part: 'JU', icon: '👕', meaning: 'Baju' },
    { part: 'BU', icon: '📚', meaning: 'Buku' },
    { part: 'KU', icon: '📚', meaning: 'Buku' },
    { part: 'BO', icon: '⚽', meaning: 'Bola' },
    { part: 'LA', icon: '⚽', meaning: 'Bola' },
    { part: 'SA', icon: '🐄', meaning: 'Sapi' },
    { part: 'PI', icon: '🐄', meaning: 'Sapi' },
  ];
  const [level2Index, setLevel2Index] = useState<number>(0);

  // Level 3: Words reading with interactive syllables
  const level3Words = [
    { word: 'BOLA', parts: ['BO', 'LA'], icon: '⚽', sentence: 'Ini bola sepak.' },
    { word: 'BUKU', parts: ['BU', 'KU'], icon: '📖', sentence: 'Membaca buku cerita.' },
    { word: 'BAJU', parts: ['BA', 'JU'], icon: '👕', sentence: 'Baju baru yang bersih.' },
    { word: 'SAPI', parts: ['SA', 'PI'], icon: '🐄', sentence: 'Sapi makan rumput.' },
    { word: 'MEJA', parts: ['ME', 'JA'], icon: '🪑', sentence: 'Meja tempat belajar.' },
  ];
  const [level3Index, setLevel3Index] = useState<number>(0);
  const [level3TouchedParts, setLevel3TouchedParts] = useState<string[]>([]);

  // Level 4: Sentences
  const currentSentence = READING_SENTENCES[currentSentenceIndex];

  // Level 5: Mini story paragraph
  const level5Stories = [
    {
      title: 'Kelinci dan Kebun Wortel',
      lines: ['Cici pergi ke kebun.', 'Cici melihat wortel oranye.', 'Wortel itu manis sekali.', 'Cici tersenyum senang.'],
      icon: '🥕🐰',
    },
    {
      title: 'Mimi dan Bola Benang',
      lines: ['Mimi punya bola benang.', 'Mimi bermain di karpet.', 'Bola benang menggelinding.', 'Mimi melompat riang.'],
      icon: '🧶🐱',
    },
  ];
  const [level5Index, setLevel5Index] = useState<number>(0);
  const [level5LineIndex, setLevel5LineIndex] = useState<number>(0);

  // Play audio for Level 4 sentence word by word
  const handleReadSentence = (sentence: ReadingSentence) => {
    soundManager.playPop();
    const parts = sentence.parts;
    let idx = 0;

    const readNextWord = () => {
      if (idx < parts.length) {
        setActiveWordIndex(idx);
        soundManager.speak(parts[idx], () => {
          idx++;
          setTimeout(readNextWord, 200);
        });
      } else {
        setActiveWordIndex(null);
        soundManager.playCorrect();
        setMascotSpeech('Hebat! Kamu sudah membaca satu kalimat lengkap!');
        onEarnReward(1, 2);
      }
    };

    readNextWord();
  };

  const handleNextInCurrentLevel = () => {
    soundManager.playPop();
    if (selectedLevel === 1) {
      setLevel1Index((prev) => (prev + 1) % level1Letters.length);
    } else if (selectedLevel === 2) {
      setLevel2Index((prev) => (prev + 1) % level2Syllables.length);
    } else if (selectedLevel === 3) {
      setLevel3Index((prev) => (prev + 1) % level3Words.length);
      setLevel3TouchedParts([]);
    } else if (selectedLevel === 4) {
      setCurrentSentenceIndex((prev) => (prev + 1) % READING_SENTENCES.length);
      setActiveWordIndex(null);
    } else if (selectedLevel === 5) {
      if (level5LineIndex < level5Stories[level5Index].lines.length - 1) {
        setLevel5LineIndex((prev) => prev + 1);
      } else {
        setLevel5LineIndex(0);
        setLevel5Index((prev) => (prev + 1) % level5Stories.length);
      }
    }
  };

  const handleLevelSelect = (lvl: number) => {
    soundManager.playPop();
    setSelectedLevel(lvl);
    setActiveWordIndex(null);
    setLevel3TouchedParts([]);
    setMascotSpeech(`Selamat datang di Membaca Level ${lvl}! Ayo kita baca bersama!`);
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

        {/* Level Badges 1 to 5 */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => handleLevelSelect(lvl)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedLevel === lvl
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Level {lvl}:{' '}
              {lvl === 1
                ? 'Huruf'
                : lvl === 2
                ? 'Suku Kata'
                : lvl === 3
                ? 'Kata'
                : lvl === 4
                ? 'Kalimat'
                : 'Cerita Mini'}
            </button>
          ))}
        </div>
      </div>

      {/* Mascot Companion Speaking */}
      <MascotCompanion mascot={activeMascot} speechText={mascotSpeech} />

      {/* LEVEL 1: MEMBACA HURUF */}
      {selectedLevel === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-200 shadow-md text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">
            Level 1: Mengenal &amp; Membaca Huruf
          </span>

          <div className="w-36 h-36 mx-auto rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex flex-col items-center justify-center shadow-lg border-4 border-white mb-4">
            <span className="text-6xl font-black">
              {level1Letters[level1Index].char}
            </span>
            <span className="text-2xl mt-1">
              {level1Letters[level1Index].icon}
            </span>
          </div>

          <div className="text-2xl font-black text-slate-800">
            Huruf {level1Letters[level1Index].char}
          </div>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Contoh kata: {level1Letters[level1Index].example}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                soundManager.playPop();
                soundManager.speak(
                  `Huruf ${level1Letters[level1Index].char}! ${level1Letters[level1Index].char} untuk ${level1Letters[level1Index].example}.`
                );
              }}
              className="py-3 px-5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-sm shadow-xs cursor-pointer flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>Dengarkan 🔊</span>
            </button>

            <button
              onClick={handleNextInCurrentLevel}
              className="py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs cursor-pointer flex items-center gap-2"
            >
              <span>Huruf Selanjutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* LEVEL 2: MEMBACA SUKU KATA */}
      {selectedLevel === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-200 shadow-md text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">
            Level 2: Membaca Suku Kata
          </span>

          <div className="w-36 h-36 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex flex-col items-center justify-center shadow-lg border-4 border-white mb-4">
            <span className="text-5xl font-black">
              {level2Syllables[level2Index].part}
            </span>
            <span className="text-2xl mt-1">
              {level2Syllables[level2Index].icon}
            </span>
          </div>

          <div className="text-3xl font-black text-slate-800">
            {level2Syllables[level2Index].part}
          </div>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Contoh dalam kata: {level2Syllables[level2Index].meaning}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                soundManager.playPop();
                soundManager.speak(
                  `${level2Syllables[level2Index].part}! ${level2Syllables[level2Index].part} dalam kata ${level2Syllables[level2Index].meaning}.`
                );
              }}
              className="py-3 px-5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-sm shadow-xs cursor-pointer flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>Dengarkan 🔊</span>
            </button>

            <button
              onClick={handleNextInCurrentLevel}
              className="py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs cursor-pointer flex items-center gap-2"
            >
              <span>Suku Kata Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* LEVEL 3: MEMBACA KATA SEDERHANA */}
      {selectedLevel === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-md text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-2">
            Level 3: Membaca Kata Sederhana
          </span>

          <div className="text-5xl mb-2">
            {level3Words[level3Index].icon}
          </div>

          <p className="text-xs font-bold text-slate-500 mb-3">
            Sentuh suku kata secara berurutan, lalu baca kata lengkapnya:
          </p>

          <div className="flex items-center justify-center gap-3 mb-4">
            {level3Words[level3Index].parts.map((p, idx) => {
              const isTouched = level3TouchedParts.includes(p);
              return (
                <button
                  key={idx}
                  onClick={() => {
                    soundManager.playPop();
                    soundManager.speak(p);
                    if (!level3TouchedParts.includes(p)) {
                      const next = [...level3TouchedParts, p];
                      setLevel3TouchedParts(next);
                      if (next.length === level3Words[level3Index].parts.length) {
                        soundManager.playCorrect();
                        const full = level3Words[level3Index].word;
                        soundManager.speak(
                          `${level3Words[level3Index].parts.join(' - ')} dibaca ${full}!`
                        );
                        setMascotSpeech(`Hebat! ${full}!`);
                        onEarnReward(1, 2);
                      }
                    }
                  }}
                  className={`px-6 py-4 rounded-2xl font-black text-2xl transition-all cursor-pointer ${
                    isTouched
                      ? 'bg-emerald-500 text-white shadow-md scale-105'
                      : 'bg-emerald-50 border-2 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {level3TouchedParts.length === level3Words[level3Index].parts.length && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 animate-in fade-in mb-4">
              <span className="text-xs text-emerald-700 font-bold block">
                Kata Lengkap:
              </span>
              <div className="text-3xl font-black text-emerald-800">
                {level3Words[level3Index].word}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                &ldquo;{level3Words[level3Index].sentence}&rdquo;
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                soundManager.playPop();
                const word = level3Words[level3Index];
                soundManager.speak(`${word.parts.join(' - ')} dibaca ${word.word}.`);
              }}
              className="py-3 px-5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-sm shadow-xs cursor-pointer flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>Dengarkan Kata 🔊</span>
            </button>

            <button
              onClick={handleNextInCurrentLevel}
              className="py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs cursor-pointer flex items-center gap-2"
            >
              <span>Kata Selanjutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* LEVEL 4: MEMBACA KALIMAT PENDEK */}
      {selectedLevel === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-200 shadow-md max-w-xl mx-auto text-center">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">
            Level 4: Membaca Kalimat Pendek
          </span>

          <div className="text-6xl my-4">
            {currentSentence.imageIcon}
          </div>

          {/* Interactive sentence with word-by-word highlights */}
          <div className="p-6 rounded-2xl bg-blue-50/70 border-2 border-blue-200 my-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {currentSentence.parts.map((word, wIdx) => {
              const isHighlight = activeWordIndex === wIdx;
              return (
                <span
                  key={wIdx}
                  onClick={() => {
                    soundManager.playPop();
                    soundManager.speak(word);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black text-2xl sm:text-3xl transition-all cursor-pointer ${
                    isHighlight
                      ? 'bg-amber-400 text-amber-950 scale-110 shadow-md ring-2 ring-amber-300'
                      : 'hover:bg-white/80 text-slate-800'
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </div>

          <p className="text-xs font-semibold text-slate-500 mb-6">
            {currentSentence.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleReadSentence(currentSentence)}
              className="py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md cursor-pointer flex items-center gap-2"
            >
              <Volume2 className="w-5 h-5" />
              <span>Dengarkan Kalimat 🔊</span>
            </button>

            <button
              onClick={() => {
                soundManager.playPop();
                setActiveWordIndex(null);
                soundManager.speak(currentSentence.text);
              }}
              className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Coba Lagi</span>
            </button>

            <button
              onClick={handleNextInCurrentLevel}
              className="py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-xs cursor-pointer flex items-center gap-2"
            >
              <span>Kalimat Lanjut</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* LEVEL 5: CERITA MINI BERGAMBAR */}
      {selectedLevel === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-200 shadow-md max-w-xl mx-auto text-center">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-2">
            Level 5: Membaca Cerita Mini
          </span>

          <h3 className="text-xl font-black text-slate-800 mb-2">
            {level5Stories[level5Index].title}
          </h3>

          <div className="text-5xl my-3">
            {level5Stories[level5Index].icon}
          </div>

          <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 my-4 text-left space-y-2">
            {level5Stories[level5Index].lines.map((line, idx) => (
              <div
                key={idx}
                onClick={() => {
                  soundManager.playPop();
                  setLevel5LineIndex(idx);
                  soundManager.speak(line);
                }}
                className={`p-2.5 rounded-xl text-base font-bold transition-all cursor-pointer ${
                  level5LineIndex === idx
                    ? 'bg-amber-300 text-amber-950 font-black shadow-xs'
                    : 'hover:bg-teal-100 text-slate-700'
                }`}
              >
                {idx + 1}. {line}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                soundManager.playPop();
                const text = level5Stories[level5Index].lines.join(' ');
                soundManager.speak(text);
              }}
              className="py-3 px-5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md cursor-pointer flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>Dengarkan Semua 🔊</span>
            </button>

            <button
              onClick={handleNextInCurrentLevel}
              className="py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-xs cursor-pointer flex items-center gap-2"
            >
              <span>Cerita Selanjutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
