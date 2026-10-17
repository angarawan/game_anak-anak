import React, { useState } from 'react';
import {
  Star,
  Coins,
  Award,
  Sparkles,
  ArrowLeft,
  Check,
  Lock,
  Heart,
  Palette,
} from 'lucide-react';
import { Mascot, MascotId, RewardItem, UserProgress } from '../../types/game';
import { MASCOTS, REWARD_ITEMS } from '../../data/learningData';
import { evaluateMedals } from '../../utils/storage';
import { soundManager } from '../../utils/audio';
import { MascotCompanion } from '../MascotCompanion';

interface RewardsGameProps {
  activeMascot: Mascot;
  progress: UserProgress;
  onSelectMascot: (id: MascotId) => void;
  onEquipAccessory: (accId?: string) => void;
  onUnlockItem: (item: RewardItem) => void;
  onBackToMenu: () => void;
}

type RewardTab = 'mascots' | 'accessories' | 'medals';

export const RewardsGame: React.FC<RewardsGameProps> = ({
  activeMascot,
  progress,
  onSelectMascot,
  onEquipAccessory,
  onUnlockItem,
  onBackToMenu,
}) => {
  const [activeTab, setActiveTab] = useState<RewardTab>('mascots');
  const [mascotSpeech, setMascotSpeech] = useState<string>(
    'Wah, lihat semua koleksi hadiah dan bintang yang sudah kamu dapatkan!'
  );

  const medals = evaluateMedals(progress);

  const handleBuyItem = (item: RewardItem) => {
    if (progress.coins < item.cost) {
      soundManager.playEncourage();
      setMascotSpeech(`Koinmu belum cukup. Kumpulkan ${item.cost - progress.coins} koin lagi ya!`);
      soundManager.speak(`Koinmu belum cukup, ayo mainkan game untuk dapat koin lagi!`);
      return;
    }

    soundManager.playCorrect();
    onUnlockItem(item);
    setMascotSpeech(`Hore! Kamu berhasil membuka ${item.name}! Keren sekali!`);
    soundManager.speak(`Hore! Kamu berhasil membuka ${item.name}!`);
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

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              soundManager.playPop();
              setActiveTab('mascots');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
              activeTab === 'mascots'
                ? 'bg-yellow-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pilih Teman Belajar
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setActiveTab('accessories');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
              activeTab === 'accessories'
                ? 'bg-yellow-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aksesoris &amp; Tema
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setActiveTab('medals');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
              activeTab === 'medals'
                ? 'bg-yellow-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Medali Juara
          </button>
        </div>
      </div>

      {/* Mascot Companion Speaking */}
      <MascotCompanion mascot={activeMascot} speechText={mascotSpeech} />

      {/* TAB 1: PILIH TEMAN BELAJAR */}
      {activeTab === 'mascots' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-md">
            <h3 className="text-xl font-black text-slate-800 mb-2">
              Pilih Sahabat Petualanganmu
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Kamu bisa memilih Cici, Mimi, atau Bobi untuk menemanimu belajar membaca dan menulis!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MASCOTS.map((m) => {
                const isSelected = activeMascot.id === m.id;

                return (
                  <div
                    key={m.id}
                    className={`rounded-3xl p-5 border-3 transition-all flex flex-col justify-between items-center text-center ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50/60 shadow-lg scale-102'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Mascot Big Photo */}
                    <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-3 border-white shadow-md my-2">
                      <img
                        src={m.image}
                        alt={m.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="mt-2">
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                        {m.species}
                      </span>
                      <h4 className="text-xl font-black text-slate-900 mt-1">
                        {m.name}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 font-medium">
                        {m.title}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        soundManager.playPop();
                        onSelectMascot(m.id);
                        setMascotSpeech(m.greeting);
                        soundManager.speak(m.greeting);
                      }}
                      className={`mt-4 w-full py-2.5 px-4 rounded-xl font-black text-xs transition-all cursor-pointer shadow-xs ${
                        isSelected
                          ? 'bg-emerald-500 text-white cursor-default'
                          : 'bg-amber-400 hover:bg-amber-500 text-amber-950 active:scale-95'
                      }`}
                    >
                      {isSelected ? '✓ Teman Aktif' : 'Pilih ' + m.name}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AKSESORIS & TEMA TOKO */}
      {activeTab === 'accessories' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-md">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-black text-slate-800">
                Toko Aksesoris Teman
              </h3>
              <p className="text-xs text-slate-500">
                Gunakan koin belajarmu untuk mempercantik teman belajarmu!
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-900 font-black text-xs border border-yellow-300">
              <Coins className="w-4 h-4 text-yellow-600" />
              <span>{progress.coins} Koin Tersedia</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {REWARD_ITEMS.map((item) => {
              const isUnlocked = progress.unlockedItems?.includes(item.id);
              const isEquipped = progress.activeAccessory === item.icon;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl p-4 border-2 border-slate-200 bg-slate-50 flex flex-col justify-between text-center"
                >
                  <div>
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-4xl mb-2">
                      {item.icon}
                    </div>
                    <h4 className="text-base font-extrabold text-slate-800">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60">
                    {isUnlocked ? (
                      <button
                        onClick={() => {
                          soundManager.playPop();
                          onEquipAccessory(isEquipped ? undefined : item.icon);
                        }}
                        className={`w-full py-2 px-3 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                          isEquipped
                            ? 'bg-rose-500 text-white'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        }`}
                      >
                        {isEquipped ? 'Lepas Aksesoris' : 'Pakai Aksesoris'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyItem(item)}
                        className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>Buka ({item.cost} Koin)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MEDALI JUARA */}
      {activeTab === 'medals' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-md">
          <h3 className="text-xl font-black text-slate-800 mb-1">
            Galeri Medali Prestasi
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Selesaikan tantangan di berbagai menu untuk membuka medali emas berkilau!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {medals.map((m) => (
              <div
                key={m.id}
                className={`rounded-2xl p-4 border-2 flex items-center gap-3.5 transition-all ${
                  m.unlocked
                    ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-xs ${
                    m.unlocked ? 'bg-amber-400 text-amber-950' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {m.unlocked ? m.icon : <Lock className="w-6 h-6 text-slate-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-extrabold text-slate-900 truncate">
                    {m.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {m.description}
                  </p>
                  <span className="text-[10px] font-bold text-amber-700 block mt-1">
                    {m.unlocked ? '✓ Terbuka' : m.requirement}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
