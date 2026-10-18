import React, { useState, useEffect } from 'react';
import { GameMenu, Mascot, MascotId, RewardItem, UserProgress } from './types/game';
import { MASCOTS } from './data/learningData';
import { loadUserProgress, saveUserProgress, INITIAL_PROGRESS } from './utils/storage';
import { soundManager } from './utils/audio';

import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { CelebrationModal } from './components/CelebrationModal';
import { BreakTimeModal } from './components/BreakTimeModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';

// 9 Sub-games
import { AlphabetGame } from './components/games/AlphabetGame';
import { SyllablesGame } from './components/games/SyllablesGame';
import { ReadingGame } from './components/games/ReadingGame';
import { WritingGame } from './components/games/WritingGame';
import { PictureGuessGame } from './components/games/PictureGuessGame';
import { WordBuilderGame } from './components/games/WordBuilderGame';
import { StoryGame } from './components/games/StoryGame';
import { RewardsGame } from './components/games/RewardsGame';
import { ProgressDashboard } from './components/games/ProgressDashboard';

export default function App() {
  const [currentMenu, setCurrentMenu] = useState<GameMenu>('menu');
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundManager.isSoundEnabled());

  // Celebration Modal state
  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    stars: number;
    coins: number;
  }>({
    isOpen: false,
    title: 'Hebat Sekali!',
    message: 'Kamu berhasil!',
    stars: 1,
    coins: 3,
  });

  // Break Time & Screen Time tracking
  const [sessionMinutes, setSessionMinutes] = useState<number>(0);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState<boolean>(false);

  // Auto increment session timer every 60 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionMinutes((prev) => {
        const next = prev + 1;
        // Prompt gentle rest notice after 10 minutes continuous play
        if (next === 10) {
          setIsBreakModalOpen(true);
        }
        return next;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Sync progress to localStorage whenever it changes
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  const activeMascot: Mascot =
    MASCOTS.find((m) => m.id === progress.activeMascot) || MASCOTS[0];

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundManager.setSoundEnabled(nextState);
  };

  const handleSelectMascot = (id: MascotId) => {
    setProgress((prev) => ({
      ...prev,
      activeMascot: id,
    }));
  };

  const handleEquipAccessory = (accIcon?: string) => {
    setProgress((prev) => ({
      ...prev,
      activeAccessory: accIcon,
    }));
  };

  const handleUnlockItem = (item: RewardItem) => {
    setProgress((prev) => ({
      ...prev,
      coins: Math.max(0, prev.coins - item.cost),
      unlockedItems: [...(prev.unlockedItems || []), item.id],
      activeAccessory: item.type === 'accessory' ? item.icon : prev.activeAccessory,
    }));
  };

  const handleEarnReward = (
    stars: number,
    coins: number,
    extraId?: string,
    showModal: boolean = false
  ) => {
    setProgress((prev) => {
      const nextLetters =
        extraId && extraId.length === 1 && !prev.lettersLearned?.includes(extraId)
          ? [...(prev.lettersLearned || []), extraId]
          : prev.lettersLearned;

      const nextSyllables =
        extraId && extraId.length === 2 && !prev.syllablesLearned?.includes(extraId)
          ? [...(prev.syllablesLearned || []), extraId]
          : prev.syllablesLearned;

      const nextWriting =
        extraId && extraId.startsWith('line_') && !prev.writingCompleted?.includes(extraId)
          ? [...(prev.writingCompleted || []), extraId]
          : prev.writingCompleted;

      const nextStories =
        extraId && extraId.startsWith('story_') && !prev.storiesCompleted?.includes(extraId)
          ? [...(prev.storiesCompleted || []), extraId]
          : prev.storiesCompleted;

      return {
        ...prev,
        stars: prev.stars + stars,
        coins: prev.coins + coins,
        lettersLearned: nextLetters,
        syllablesLearned: nextSyllables,
        wordsReadCount: prev.wordsReadCount + (stars > 0 ? 1 : 0),
        writingCompleted: nextWriting,
        storiesCompleted: nextStories,
      };
    });

    if (showModal) {
      setCelebration({
        isOpen: true,
        title: 'Bintang Baru Didapatkan! ⭐',
        message: 'Kerja bagus! Terus kumpulkan bintang dan koin hadiahmu!',
        stars,
        coins,
      });
    }
  };

  const handleResetProgress = () => {
    setProgress(INITIAL_PROGRESS);
    saveUserProgress(INITIAL_PROGRESS);
    soundManager.speak('Progres belajar telah diatur ulang. Ayo mulai petualangan baru!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-sky-50 to-amber-50 text-slate-800 flex flex-col font-sans selection:bg-amber-200">
      {/* Top Header Navigation */}
      <Header
        currentMenu={currentMenu}
        onNavigate={setCurrentMenu}
        stars={progress.stars}
        coins={progress.coins}
        activeMascot={activeMascot}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        sessionMinutes={sessionMinutes}
        onOpenBreakModal={() => setIsBreakModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentMenu === 'menu' && (
          <MainMenu
            onSelectMenu={setCurrentMenu}
            activeMascot={activeMascot}
            progress={progress}
          />
        )}

        {currentMenu === 'alphabet' && (
          <AlphabetGame
            activeMascot={activeMascot}
            progress={progress}
            onEarnReward={(stars, coins, letter) =>
              handleEarnReward(stars, coins, letter)
            }
            onBackToMenu={() => setCurrentMenu('menu')}
          />
        )}

        {currentMenu === 'syllables' && (
          <SyllablesGame
            activeMascot={activeMascot}
            progress={progress}
            onEarnReward={(stars, coins, syllable) =>
              handleEarnReward(stars, coins, syllable)
            }
            onBackToMenu={() => setCurrentMenu('menu')}
          />
        )}

        {currentMenu === 'reading' && (
          <ReadingGame
            activeMascot={activeMascot}
            progress={progress}
            onEarnReward={(stars, coins) => handleEarnReward(stars, coins)}
            onBackToMenu={() => setCurrentMenu('menu')}
          />
        )}

        {currentMenu === 'writing' && (
          <WritingGame
            activeMascot={activeMascot}
            progress={progress}
            onEarnReward={(stars, coins, writingId) =>
              handleEarnReward(stars, coins, writingId)
            }
            onBackToMenu={() => setCurrentMenu('menu')}
          />
        )}

        {currentMenu === 'picture_guess' && (
          <PictureGuessGame
            activeMascot={activeMascot}
            progress={progress}
            onEarnReward={(stars, coins) => handleEarnReward(stars, coins)}
            onBackToMenu={() => setCurrentMenu('menu')}
          />
        )}

        {currentMenu === 'word_builder' && (
          <WordBuilderGame
            activeMascot={activeMascot}
            progress={progress}
            onEarnReward={(stars, coins) => handleEarnReward(stars, coins)}
            onBackToMenu={() => setCurrentMenu('menu')}
          />
        )}

        {currentMenu === 'story' && (
          <StoryGame
            activeMascot={activeMascot}
            progress={progress}
            onEarnReward={(stars, coins, storyId) =>
              handleEarnReward(stars, coins, storyId)
            }
            onBackToMenu={() => setCurrentMenu('menu')}
          />
        )}

        {currentMenu === 'rewards' && (
          <RewardsGame
            activeMascot={activeMascot}
            progress={progress}
            onSelectMascot={handleSelectMascot}
            onEquipAccessory={handleEquipAccessory}
            onUnlockItem={handleUnlockItem}
            onBackToMenu={() => setCurrentMenu('menu')}
          />
        )}

        {currentMenu === 'progress' && (
          <ProgressDashboard
            activeMascot={activeMascot}
            progress={progress}
            onResetProgress={handleResetProgress}
            onBackToMenu={() => setCurrentMenu('menu')}
            onOpenBreakModal={() => setIsBreakModalOpen(true)}
          />
        )}
      </main>

      {/* Gentle Child-Safe Footer */}
      <footer className="mt-auto py-6 border-t border-emerald-100 bg-white/70 backdrop-blur-xs text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-700">
              Petualangan Pintar
            </span>
            <span aria-hidden="true">·</span>
            <span>Ayo Membaca dan Menulis!</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 font-bold">100% Bebas Iklan &amp; Aman untuk Anak</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Dirancang penuh kasih sayang untuk anak usia 4–8 tahun
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CelebrationModal
        isOpen={celebration.isOpen}
        title={celebration.title}
        message={celebration.message}
        starsGained={celebration.stars}
        coinsGained={celebration.coins}
        onNext={() => setCelebration((prev) => ({ ...prev, isOpen: false }))}
      />

      <BreakTimeModal
        isOpen={isBreakModalOpen}
        onClose={() => setIsBreakModalOpen(false)}
        minutesSpent={sessionMinutes}
      />

      {/* PWA Direct Mobile Install Prompt */}
      <PWAInstallBanner />
    </div>
  );
}
