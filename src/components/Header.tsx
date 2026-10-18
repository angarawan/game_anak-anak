import React from 'react';
import { Volume2, VolumeX, Sparkles, Star, Coins, Home, Clock } from 'lucide-react';
import { GameMenu, Mascot } from '../types/game';
import { soundManager } from '../utils/audio';
import { PWAHeaderInstallButton } from './PWAInstallBanner';

interface HeaderProps {
  currentMenu: GameMenu;
  onNavigate: (menu: GameMenu) => void;
  stars: number;
  coins: number;
  activeMascot: Mascot;
  soundEnabled: boolean;
  onToggleSound: () => void;
  sessionMinutes: number;
  onOpenBreakModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMenu,
  onNavigate,
  stars,
  coins,
  activeMascot,
  soundEnabled,
  onToggleSound,
  sessionMinutes,
  onOpenBreakModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              soundManager.playPop();
              onNavigate('menu');
            }}
            className="flex items-center gap-2 text-left group cursor-pointer focus:outline-hidden"
            title="Kembali ke Menu Utama"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-400 to-emerald-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight block leading-tight">
                Petualangan Pintar
              </span>
              <span className="text-xs font-semibold text-emerald-600 block">
                Ayo Membaca &amp; Menulis!
              </span>
            </div>
          </button>

          {currentMenu !== 'menu' && (
            <button
              onClick={() => {
                soundManager.playPop();
                onNavigate('menu');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition-colors cursor-pointer border border-emerald-200"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Menu</span>
            </button>
          )}
        </div>

        {/* Zone 2: Progress & Companion Info */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-1">
          {/* Active Mascot Avatar Badge */}
          <button
            onClick={() => {
              soundManager.playPop();
              onNavigate('rewards');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-xs font-semibold text-slate-700 shrink-0"
            title="Ganti Teman Belajar & Kostum"
          >
            <img
              src={activeMascot.image}
              alt={activeMascot.name}
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover border border-amber-300"
            />
            <span className="hidden md:inline">{activeMascot.name}</span>
          </button>

          {/* Stars tally */}
          <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-bold shrink-0">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span className="tabular-nums font-mono text-sm">{stars}</span>
            <span className="hidden sm:inline text-amber-700">Bintang</span>
          </div>

          {/* Coins tally */}
          <div className="flex items-center gap-1 px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-full text-xs font-bold shrink-0">
            <Coins className="w-4 h-4 text-yellow-600" />
            <span className="tabular-nums font-mono text-sm">{coins}</span>
            <span className="hidden sm:inline text-yellow-700">Koin</span>
          </div>

          {/* Rest / Session Timer */}
          <button
            onClick={() => {
              soundManager.playPop();
              onOpenBreakModal();
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 rounded-full text-xs font-medium shrink-0 cursor-pointer transition-colors"
            title="Waktu Belajar & Istirahat"
          >
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span className="tabular-nums font-mono text-xs">{sessionMinutes}m</span>
            <span className="hidden lg:inline text-sky-600 text-[11px]">Istirahat</span>
          </button>
        </div>

        {/* Zone 3: Primary Actions (Install App + Sound) */}
        <div className="flex items-center gap-2 shrink-0">
          <PWAHeaderInstallButton />

          <button
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) {
                soundManager.playPop();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              soundEnabled
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
            }`}
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span className="hidden sm:inline">Suara: Nyala</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">Suara: Mati</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
