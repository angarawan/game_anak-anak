import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Star,
  Award,
} from 'lucide-react';
import { Mascot, StoryBook, UserProgress } from '../../types/game';
import { STORIES_DATA } from '../../data/learningData';
import { soundManager } from '../../utils/audio';
import { MascotCompanion } from '../MascotCompanion';

interface StoryGameProps {
  activeMascot: Mascot;
  progress: UserProgress;
  onEarnReward: (stars: number, coins: number, storyId?: string) => void;
  onBackToMenu: () => void;
}

export const StoryGame: React.FC<StoryGameProps> = ({
  activeMascot,
  progress,
  onEarnReward,
  onBackToMenu,
}) => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number>(0);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const currentBook: StoryBook = STORIES_DATA[selectedStoryIndex];
  const currentPage = currentBook.pages[currentPageIndex];
  const isLastPage = currentPageIndex === currentBook.pages.length - 1;

  const [mascotSpeech, setMascotSpeech] = useState<string>(
    `Ayo dengarkan cerita bergambar seru: ${currentBook.title}!`
  );

  const handleReadCurrentPage = () => {
    soundManager.playPop();
    soundManager.speak(currentPage.text);
    setMascotSpeech(`Dengarkan cerita halaman ${currentPage.pageNumber}: ${currentPage.text}`);
  };

  const handleNextPage = () => {
    soundManager.playPop();
    if (!isLastPage) {
      setCurrentPageIndex((prev) => prev + 1);
    } else {
      setShowQuiz(true);
      const speech = `Wah, ceritanya sudah selesai! Sekarang mari jawab pertanyaan seru ini: ${currentBook.quizQuestion.question}`;
      setMascotSpeech(speech);
      soundManager.speak(speech);
    }
  };

  const handlePrevPage = () => {
    soundManager.playPop();
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
      setShowQuiz(false);
    }
  };

  const handleSelectBook = (idx: number) => {
    soundManager.playPop();
    setSelectedStoryIndex(idx);
    setCurrentPageIndex(0);
    setShowQuiz(false);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleQuizAnswer = (optionIdx: number) => {
    soundManager.playPop();
    setSelectedQuizAnswer(optionIdx);
    setQuizSubmitted(true);

    if (optionIdx === currentBook.quizQuestion.correctIndex) {
      soundManager.playCorrect();
      const speech = 'Pintar sekali! Jawabanmu benar! Kamu hebat dalam menyimak cerita!';
      setMascotSpeech(speech);
      soundManager.speak(speech);
      onEarnReward(2, 5, currentBook.id);
    } else {
      soundManager.playEncourage();
      setMascotSpeech('Ayo coba lagi, ingat apa yang dilakukan karakter di cerita tadi ya!');
      soundManager.speak('Ayo coba lagi, ingat cerita yang kita baca tadi!');
    }
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

        {/* Story Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {STORIES_DATA.map((book, idx) => (
            <button
              key={book.id}
              onClick={() => handleSelectBook(idx)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedStoryIndex === idx
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cerita {idx + 1}: {book.title}
            </button>
          ))}
        </div>
      </div>

      {/* Mascot Companion Speaking */}
      <MascotCompanion mascot={activeMascot} speechText={mascotSpeech} />

      {/* Main Story Container */}
      {!showQuiz ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-200 shadow-md max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-extrabold text-teal-600 uppercase tracking-wider block">
                {currentBook.author}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                {currentBook.title}
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Halaman {currentPage.pageNumber} dari {currentBook.pages.length}
            </span>
          </div>

          {/* Illustrated Scene Box */}
          <div
            className={`w-full aspect-video sm:aspect-21/9 rounded-3xl ${currentPage.sceneColor} border-2 border-teal-100 flex items-center justify-center shadow-inner my-4 relative overflow-hidden`}
          >
            <span className="text-7xl sm:text-8xl select-none filter drop-shadow-md">
              {currentPage.illustrationScene}
            </span>

            {currentPage.interactiveItem && (
              <button
                onClick={() => {
                  soundManager.playPop();
                  soundManager.speak(currentPage.interactiveItem!.sound);
                }}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-teal-800 font-bold text-xs shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{currentPage.interactiveItem.label}</span>
              </button>
            )}
          </div>

          {/* Story Text Box with Readable Font */}
          <div className="p-6 rounded-2xl bg-teal-50/70 border border-teal-200 my-4 text-center">
            <p className="text-lg sm:text-xl font-bold text-slate-800 leading-relaxed font-sans">
              &ldquo;{currentPage.text}&rdquo;
            </p>
          </div>

          {/* Story Reading Controls */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handlePrevPage}
              disabled={currentPageIndex === 0}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                currentPageIndex === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Halaman Sebelumnya</span>
            </button>

            <button
              onClick={handleReadCurrentPage}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-extrabold text-xs shadow-xs cursor-pointer transition-all active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>Bacakan Cerita Ini 🔊</span>
            </button>

            <button
              onClick={handleNextPage}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-xs cursor-pointer transition-all"
            >
              <span>{isLastPage ? 'Kuis Cerita!' : 'Halaman Berikutnya'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* QUIZ SCREEN AT THE END OF STORY */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-md max-w-xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
            <Award className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
            Kuis Pemahaman Cerita
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800">
            {currentBook.quizQuestion.question}
          </h3>

          <div className="my-6 space-y-3">
            {currentBook.quizQuestion.options.map((opt, optIdx) => {
              const isSelected = selectedQuizAnswer === optIdx;
              const isRight =
                quizSubmitted && optIdx === currentBook.quizQuestion.correctIndex;
              const isWrong = isSelected && !isRight;

              return (
                <button
                  key={optIdx}
                  onClick={() => handleQuizAnswer(optIdx)}
                  className={`w-full py-4 px-5 rounded-2xl font-black text-base text-left transition-all cursor-pointer flex items-center justify-between ${
                    isRight
                      ? 'bg-emerald-500 text-white shadow-md border-2 border-emerald-600'
                      : isWrong
                      ? 'bg-amber-100 text-amber-900 border-2 border-amber-300'
                      : 'bg-slate-50 hover:bg-teal-50 text-slate-800 border-2 border-slate-200'
                  }`}
                >
                  <span>{opt}</span>
                  {isRight && <CheckCircle2 className="w-5 h-5 text-white" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                soundManager.playPop();
                setShowQuiz(false);
                setCurrentPageIndex(0);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Baca Ulang Cerita</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
