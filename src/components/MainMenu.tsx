import React from 'react';
import {
  Sparkles,
  BookOpen,
  PenTool,
  Grid,
  Image as ImageIcon,
  Puzzle,
  Award,
  BarChart3,
  Volume2,
  Play,
  Heart,
  Download,
  Smartphone,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { GameMenu, Mascot, UserProgress } from '../types/game';
import { soundManager } from '../utils/audio';
import { heroBgImg } from '../data/learningData';

interface MainMenuProps {
  onSelectMenu: (menu: GameMenu) => void;
  activeMascot: Mascot;
  progress: UserProgress;
}

interface MenuItemConfig {
  id: GameMenu;
  number: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  buttonBg: string;
  tagText: string;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onSelectMenu,
  activeMascot,
  progress,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const menuItems: MenuItemConfig[] = [
    {
      id: 'alphabet',
      number: '01',
      title: 'Ayo Kenal Huruf',
      subtitle: 'Mengenal alfabet A-Z, vokal & konsonan dengan suara ramah.',
      icon: <span className="text-3xl">🔤</span>,
      colorBg: 'bg-rose-50',
      colorBorder: 'border-rose-200 hover:border-rose-400',
      colorText: 'text-rose-900',
      buttonBg: 'bg-rose-500 hover:bg-rose-600',
      tagText: `${progress.lettersLearned?.length || 0}/26 Huruf Dikenal`,
    },
    {
      id: 'syllables',
      number: '02',
      title: 'Bermain Suku Kata',
      subtitle: 'Latihan BA-BI-BU-BE-BO dan menggabungkan suku kata jadi kata.',
      icon: <span className="text-3xl">🗣️</span>,
      colorBg: 'bg-amber-50',
      colorBorder: 'border-amber-200 hover:border-amber-400',
      colorText: 'text-amber-900',
      buttonBg: 'bg-amber-500 hover:bg-amber-600',
      tagText: `${progress.syllablesLearned?.length || 0} Suku Kata Kuasai`,
    },
    {
      id: 'reading',
      number: '03',
      title: 'Ayo Membaca',
      subtitle: '5 Level bertahap: huruf, suku kata, kata, hingga kalimat pendek.',
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      colorBg: 'bg-blue-50',
      colorBorder: 'border-blue-200 hover:border-blue-400',
      colorText: 'text-blue-900',
      buttonBg: 'bg-blue-500 hover:bg-blue-600',
      tagText: '5 Level Menantang',
    },
    {
      id: 'writing',
      number: '04',
      title: 'Belajar Menulis',
      subtitle: 'Tarik garis, tebalkan huruf putus-putus dengan jari atau mouse.',
      icon: <PenTool className="w-8 h-8 text-emerald-600" />,
      colorBg: 'bg-emerald-50',
      colorBorder: 'border-emerald-200 hover:border-emerald-400',
      colorText: 'text-emerald-900',
      buttonBg: 'bg-emerald-500 hover:bg-emerald-600',
      tagText: `${progress.writingCompleted?.length || 0} Latihan Menulis`,
    },
    {
      id: 'picture_guess',
      number: '05',
      title: 'Tebak Gambar',
      subtitle: 'Pilih kata yang tepat untuk gambar hewan, buah, dan benda.',
      icon: <ImageIcon className="w-8 h-8 text-purple-600" />,
      colorBg: 'bg-purple-50',
      colorBorder: 'border-purple-200 hover:border-purple-400',
      colorText: 'text-purple-900',
      buttonBg: 'bg-purple-500 hover:bg-purple-600',
      tagText: 'Kuis Ceria & Suara',
    },
    {
      id: 'word_builder',
      number: '06',
      title: 'Susun Kata',
      subtitle: 'Susun huruf acak menjadi kata lengkap dengan petunjuk seru.',
      icon: <Puzzle className="w-8 h-8 text-orange-600" />,
      colorBg: 'bg-orange-50',
      colorBorder: 'border-orange-200 hover:border-orange-400',
      colorText: 'text-orange-900',
      buttonBg: 'bg-orange-500 hover:bg-orange-600',
      tagText: '3, 4, & 6 Huruf',
    },
    {
      id: 'story',
      number: '07',
      title: 'Cerita Bergambar',
      subtitle: 'Buku cerita interaktif dengan penyorotan kalimat dan audio.',
      icon: <span className="text-3xl">📖</span>,
      colorBg: 'bg-teal-50',
      colorBorder: 'border-teal-200 hover:border-teal-400',
      colorText: 'text-teal-900',
      buttonBg: 'bg-teal-500 hover:bg-teal-600',
      tagText: `${progress.storiesCompleted?.length || 0} Cerita Selesai`,
    },
    {
      id: 'rewards',
      number: '08',
      title: 'Hadiah & Bintang',
      subtitle: 'Tukarkan bintang & koin untuk kostum teman, tema, dan medali juara.',
      icon: <Award className="w-8 h-8 text-yellow-600" />,
      colorBg: 'bg-yellow-50',
      colorBorder: 'border-yellow-200 hover:border-yellow-400',
      colorText: 'text-yellow-900',
      buttonBg: 'bg-yellow-500 hover:bg-yellow-600',
      tagText: `${progress.stars} Bintang Tersedia`,
    },
    {
      id: 'progress',
      number: '09',
      title: 'Progres Belajarku',
      subtitle: 'Lihat catatan kemajuan belajar dan Dashboard Orang Tua / Guru.',
      icon: <BarChart3 className="w-8 h-8 text-sky-600" />,
      colorBg: 'bg-sky-50',
      colorBorder: 'border-sky-200 hover:border-sky-400',
      colorText: 'text-sky-900',
      buttonBg: 'bg-sky-500 hover:bg-sky-600',
      tagText: 'Catatan & Saran Belajar',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border-2 border-emerald-100 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white p-6 sm:p-10">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${heroBgImg})` }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Petualangan Edukasi Ceria Usia 4–8 Tahun</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight drop-shadow-xs">
              Ayo Membaca dan Menulis!
            </h1>

            <p className="mt-2.5 text-emerald-50 text-sm sm:text-base font-medium max-w-xl">
              Belajar mengenal huruf alfabet, merangkai suku kata, membaca kalimat, dan melatih motorik menulis dengan penuh kegembiraan!
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => {
                  soundManager.playPop();
                  onSelectMenu('alphabet');
                }}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-sm sm:text-base shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <Play className="w-5 h-5 fill-amber-950" />
                <span>Mulai Belajar Sekarang!</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playPop();
                  soundManager.speak(
                    `Halo teman pintar! Selamat datang di Petualangan Pintar. Aku ${activeMascot.name}, teman belajarmu hari ini! Pilih menu di bawah untuk mulai bermain ya!`
                  );
                }}
                className="px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                <span>Sapa {activeMascot.name} 🔊</span>
              </button>

              {!isInstalled && (
                <button
                  onClick={async () => {
                    soundManager.playPop();
                    if (isInstallable) {
                      await install();
                    } else {
                      const headerBtn = document.querySelector('[title="Pasang Game di HP"]');
                      if (headerBtn) (headerBtn as HTMLElement).click();
                    }
                  }}
                  className="px-4 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <Smartphone className="w-4 h-4 text-emerald-600 animate-bounce" />
                  <span>Pasang di HP 📱</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Mascot in Hero */}
          <div className="relative group shrink-0">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white/30 backdrop-blur-md flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
              <img
                src={activeMascot.image}
                alt={activeMascot.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 inset-x-0 flex justify-center">
              <span className="bg-amber-400 text-amber-950 text-xs font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Heart className="w-3 h-3 fill-rose-500 text-rose-600" />
                <span>{activeMascot.name}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            Pilih Petualangan Belajarmu
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Sentuh salah satu menu seru di bawah ini untuk mulai belajar
          </p>
        </div>
      </div>

      {/* 9 Main Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              soundManager.playPop();
              onSelectMenu(item.id);
            }}
            className={`group relative rounded-3xl p-5 border-2 ${item.colorBg} ${item.colorBorder} transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-white/80 border border-slate-200/60 text-slate-600">
                  {item.tagText}
                </span>
              </div>

              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                Menu {item.number}
              </div>

              <h3 className={`text-xl font-black ${item.colorText} tracking-tight`}>
                {item.title}
              </h3>

              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {item.subtitle}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200/50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                Mulai Bermain
              </span>
              <div
                className={`w-9 h-9 rounded-xl ${item.buttonBg} text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}
              >
                <Play className="w-4 h-4 fill-white translate-x-0.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
