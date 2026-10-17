import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Sparkles,
  RotateCcw,
  Star,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  Flame,
} from 'lucide-react';
import { LetterData, Mascot, UserProgress } from '../../types/game';
import { LETTERS_DATA } from '../../data/learningData';
import { soundManager } from '../../utils/audio';
import { MascotCompanion } from '../MascotCompanion';

interface AlphabetGameProps {
  activeMascot: Mascot;
  progress: UserProgress;
  onEarnReward: (stars: number, coins: number, letter?: string) => void;
  onBackToMenu: () => void;
}

type TabMode = 'all' | 'vowels' | 'consonants' | 'quiz';

export const AlphabetGame: React.FC<AlphabetGameProps> = ({
  activeMascot,
  progress,
  onEarnReward,
  onBackToMenu,
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('vowels');
  const [selectedLetter, setSelectedLetter] = useState<LetterData>(LETTERS_DATA[0]);
  const [mascotSpeech, setMascotSpeech] = useState<string>(
    'Sentuh huruf vokal di bawah untuk mendengarkan bunyinya!'
  );

  // Quiz Mode State
  const [quizTarget, setQuizTarget] = useState<LetterData | null>(null);
  const [quizOptions, setQuizOptions] = useState<LetterData[]>([]);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<{
    status: 'correct' | 'wrong' | 'idle';
    message: string;
  }>({ status: 'idle', message: '' });

  // Filter letters based on active tab
  const displayedLetters = LETTERS_DATA.filter((item) => {
    if (activeTab === 'vowels') return item.isVowel;
    if (activeTab === 'consonants') return !item.isVowel;
    return true; // 'all'
  });

  const handleSelectLetter = (item: LetterData) => {
    soundManager.playPop();
    soundManager.playLetterTone(item.letter);
    setSelectedLetter(item);

    const speech = `Huruf ${item.letter}! ${item.letter} untuk ${item.word}. ${item.exampleSentence}`;
    setMascotSpeech(speech);
    soundManager.speak(speech);

    // Record learning
    onEarnReward(0, 1, item.letter);
  };

  // Start new quiz round
  const startNewQuizRound = () => {
    const randomTarget = LETTERS_DATA[Math.floor(Math.random() * LETTERS_DATA.length)];
    // Pick 3 distractors
    const otherLetters = LETTERS_DATA.filter((l) => l.letter !== randomTarget.letter);
    const shuffledOthers = [...otherLetters].sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [randomTarget, ...shuffledOthers].sort(() => 0.5 - Math.random());

    setQuizTarget(randomTarget);
    setQuizOptions(options);
    setQuizFeedback({ status: 'idle', message: '' });

    const promptText = `Teman pintar, ayo pilih huruf ${randomTarget.letter}!`;
    setMascotSpeech(promptText);
    soundManager.speak(promptText);
  };

  useEffect(() => {
    if (activeTab === 'quiz') {
      startNewQuizRound();
    } else {
      setMascotSpeech(
        activeTab === 'vowels'
          ? 'Mari mulai dari huruf vokal: A, I, U, E, O!'
          : 'Sekarang mari pelajari huruf konsonan alfabet!'
      );
    }
  }, [activeTab]);

  const handleQuizAnswer = (chosen: LetterData) => {
    if (!quizTarget) return;

    if (chosen.letter === quizTarget.letter) {
      soundManager.playCorrect();
      setQuizScore((prev) => prev + 1);
      const praises = activeMascot.praisePhrases;
      const praise = praises[Math.floor(Math.random() * praises.length)];
      setQuizFeedback({
        status: 'correct',
        message: `${praise} Kamu benar, ini huruf ${chosen.letter} untuk ${chosen.word}!`,
      });
      setMascotSpeech(`${praise}! Jawabanmu tepat!`);
      soundManager.speak(`${praise}! Jawabanmu tepat sekali!`);
      onEarnReward(1, 3, chosen.letter);

      // Auto next question after 1.5s
      setTimeout(() => {
        startNewQuizRound();
      }, 1600);
    } else {
      soundManager.playEncourage();
      const encourages = activeMascot.encouragePhrases;
      const encourage = encourages[Math.floor(Math.random() * encourages.length)];
      setQuizFeedback({
        status: 'wrong',
        message: `${encourage} Yang kamu sentuh adalah huruf ${chosen.letter}. Coba cari huruf ${quizTarget.letter} ya!`,
      });
      setMascotSpeech(`Yuk coba lagi, cari huruf ${quizTarget.letter}!`);
      soundManager.speak(`Yuk coba lagi! Cari huruf ${quizTarget.letter}!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation for Game */}
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

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              soundManager.playPop();
              setActiveTab('vowels');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'vowels'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vokal (A, I, U, E, O)
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setActiveTab('consonants');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'consonants'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Konsonan (B–Z)
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setActiveTab('all');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua A–Z
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setActiveTab('quiz');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'quiz'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-700 bg-amber-100/60 hover:bg-amber-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kuis Tebak Huruf</span>
          </button>
        </div>
      </div>

      {/* Mascot Companion Speaking */}
      <MascotCompanion mascot={activeMascot} speechText={mascotSpeech} />

      {/* QUIZ MODE */}
      {activeTab === 'quiz' ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-md text-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>Skor Kuis: {quizScore}</span>
            </div>
            <button
              onClick={() => {
                soundManager.playPop();
                if (quizTarget) {
                  soundManager.speak(`Ayo cari dan pilih huruf ${quizTarget.letter}!`);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Ulangi Suara</span>
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            Tebak Huruf yang Disebutkan Karakter:
          </h2>
          <div className="my-4 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-amber-100 text-amber-800 border-4 border-amber-300 shadow-inner">
            <HelpCircle className="w-12 h-12 animate-pulse text-amber-600" />
          </div>

          {quizFeedback.message && (
            <div
              className={`p-3 rounded-2xl text-xs sm:text-sm font-bold mb-6 max-w-md mx-auto ${
                quizFeedback.status === 'correct'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 animate-in fade-in'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 animate-in fade-in'
              }`}
            >
              {quizFeedback.message}
            </div>
          )}

          {/* Quiz Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
            {quizOptions.map((opt) => (
              <button
                key={opt.letter}
                onClick={() => handleQuizAnswer(opt)}
                className="py-6 px-4 rounded-3xl bg-white border-3 border-amber-300 hover:border-amber-500 hover:bg-amber-50 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-1"
              >
                <span className="text-4xl sm:text-5xl font-black text-slate-800">
                  {opt.letter}
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  {opt.letter.toLowerCase()}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                soundManager.playPop();
                startNewQuizRound();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ganti Pertanyaan Baru</span>
            </button>
          </div>
        </div>
      ) : (
        /* EXPLORATION MODE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alphabet Grid */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-100 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-800">
                Pilih Huruf Alfabet
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                Sentuh huruf untuk mendengar suara
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2.5 sm:gap-3">
              {displayedLetters.map((item) => {
                const isSelected = selectedLetter.letter === item.letter;
                const isLearned = progress.lettersLearned?.includes(item.letter);

                return (
                  <button
                    key={item.letter}
                    onClick={() => handleSelectLetter(item)}
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer font-black ${
                      isSelected
                        ? 'bg-rose-500 text-white ring-4 ring-rose-200 scale-105 shadow-md'
                        : isLearned
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-2 border-rose-200'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-2 border-slate-200'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl leading-none">
                      {item.letter}
                    </span>
                    <span className="text-[11px] font-medium opacity-80 mt-0.5">
                      {item.letter.toLowerCase()}
                    </span>

                    {isLearned && (
                      <CheckCircle2
                        className={`absolute top-1 right-1 w-3.5 h-3.5 ${
                          isSelected ? 'text-white' : 'text-emerald-500'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Letter Card Showcase */}
          <div className="bg-white rounded-3xl p-6 border-2 border-rose-200 shadow-md flex flex-col items-center text-center justify-between">
            <div className="w-full">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kartu Huruf Pilihan</span>
              </div>

              {/* Big Letter Representation */}
              <div className="relative w-36 h-36 mx-auto rounded-3xl bg-gradient-to-tr from-rose-400 to-pink-500 text-white flex items-center justify-center shadow-lg border-4 border-white mb-4">
                <span className="text-6xl sm:text-7xl font-black">
                  {selectedLetter.letter}
                </span>
                <span className="absolute bottom-2 right-3 text-3xl">
                  {selectedLetter.iconSvg}
                </span>
              </div>

              <div className="text-2xl font-black text-slate-800 tracking-tight">
                {selectedLetter.word}
              </div>

              <div className="mt-1 inline-block px-3 py-1 rounded-lg bg-slate-100 font-mono font-bold text-xs text-slate-600">
                {selectedLetter.syllables}
              </div>

              <p className="mt-3 text-xs sm:text-sm text-slate-600 font-medium px-2 leading-relaxed">
                &ldquo;{selectedLetter.exampleSentence}&rdquo;
              </p>
            </div>

            <div className="mt-6 w-full pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  soundManager.playPop();
                  const speech = `Huruf ${selectedLetter.letter}! ${selectedLetter.letter} untuk ${selectedLetter.word}. ${selectedLetter.exampleSentence}`;
                  soundManager.speak(speech);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
                <span>Dengarkan Pelafalan 🔊</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
