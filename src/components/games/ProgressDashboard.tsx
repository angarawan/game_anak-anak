import React, { useState } from 'react';
import {
  BarChart3,
  Star,
  Coins,
  BookOpen,
  PenTool,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Heart,
  Sliders,
  ShieldAlert,
} from 'lucide-react';
import { Mascot, UserProgress } from '../../types/game';
import { LETTERS_DATA } from '../../data/learningData';
import { soundManager } from '../../utils/audio';
import { MascotCompanion } from '../MascotCompanion';

interface ProgressDashboardProps {
  activeMascot: Mascot;
  progress: UserProgress;
  onResetProgress: () => void;
  onBackToMenu: () => void;
  onOpenBreakModal: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  activeMascot,
  progress,
  onResetProgress,
  onBackToMenu,
  onOpenBreakModal,
}) => {
  const [activeTab, setActiveTab] = useState<'child' | 'parent'>('child');
  const [parentUnlocked, setParentUnlocked] = useState<boolean>(false);
  const [parentPasscodeInput, setParentPasscodeInput] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string>('');

  const lettersLearnedCount = progress.lettersLearned?.length || 0;
  const syllablesLearnedCount = progress.syllablesLearned?.length || 0;
  const writingCount = progress.writingCompleted?.length || 0;

  // Gentle recommendations without shaming
  const recommendedNext =
    lettersLearnedCount < 10
      ? 'Ayo lengkapi pengenalan huruf alfabet di menu "Ayo Kenal Huruf"!'
      : syllablesLearnedCount < 10
      ? 'Hebat sudah mengenal banyak huruf! Sekarang yuk bermain suku kata di menu "Bermain Suku Kata"!'
      : writingCount < 5
      ? 'Tanganmu siap mencoba kanvas menulis di menu "Belajar Menulis"!'
      : 'Kamu sudah luar biasa! Yuk baca buku cerita seru di menu "Cerita Bergambar"!';

  const handleUnlockParentGate = () => {
    // Simple math question lock: 3 + 4 = 7
    if (parentPasscodeInput.trim() === '7') {
      soundManager.playPop();
      setParentUnlocked(true);
      setPasscodeError('');
    } else {
      soundManager.playEncourage();
      setPasscodeError('Jawaban belum tepat. Berapa hasil dari 3 + 4?');
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

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              soundManager.playPop();
              setActiveTab('child');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
              activeTab === 'child'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prestasi Ananda 🌟
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setActiveTab('parent');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
              activeTab === 'parent'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dashboard Orang Tua / Guru 👨‍👩‍👧
          </button>
        </div>
      </div>

      {/* Mascot Companion Speaking */}
      <MascotCompanion
        mascot={activeMascot}
        speechText={
          activeTab === 'child'
            ? 'Lihat prestasimu yang bersinar cerah! Setiap hari kamu semakin bertambah pintar!'
            : 'Dashboard ini menyajikan laporan perkembangan belajar anak secara positif dan suportif.'
        }
      />

      {/* CHILD PRESTASI VIEW */}
      {activeTab === 'child' ? (
        <div className="space-y-6">
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-xs text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
                <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-slate-800 font-mono">
                {progress.stars}
              </div>
              <span className="text-xs font-bold text-slate-500">
                Bintang Terkumpul
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border-2 border-rose-200 shadow-xs text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-black mb-2">
                Aa
              </div>
              <div className="text-3xl font-black text-slate-800 font-mono">
                {lettersLearnedCount}/26
              </div>
              <span className="text-xs font-bold text-slate-500">
                Huruf Dikenal
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border-2 border-blue-200 shadow-xs text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-800 font-mono">
                {progress.wordsReadCount}
              </div>
              <span className="text-xs font-bold text-slate-500">
                Kata Berhasil Dibaca
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-xs text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                <PenTool className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-800 font-mono">
                {writingCount}
              </div>
              <span className="text-xs font-bold text-slate-500">
                Latihan Menulis
              </span>
            </div>
          </div>

          {/* Letter Mastery Visual Grid */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-md">
            <h3 className="text-lg font-black text-slate-800 mb-1">
              Peta Huruf Alfabetku (A–Z)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Huruf dengan tanda bintang hijau adalah huruf yang sudah kamu sentuh dan pelajari!
            </p>

            <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-2">
              {LETTERS_DATA.map((l) => {
                const mastered = progress.lettersLearned?.includes(l.letter);
                return (
                  <div
                    key={l.letter}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center font-black text-base sm:text-lg border transition-all ${
                      mastered
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    <span>{l.letter}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Encouraging Recommendation Banner */}
          <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Rekomendasi Petualangan Berikutnya</span>
              </div>
              <p className="text-sm sm:text-base font-bold mt-1 text-sky-50">
                {recommendedNext}
              </p>
            </div>
            <button
              onClick={() => {
                soundManager.playPop();
                soundManager.speak(recommendedNext);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs shrink-0 cursor-pointer shadow-xs active:scale-95"
            >
              Dengarkan Saran 🔊
            </button>
          </div>
        </div>
      ) : (
        /* PARENT & TEACHER DASHBOARD */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md">
          {!parentUnlocked ? (
            <div className="max-w-md mx-auto text-center py-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-800">
                Kunci Dashboard Orang Tua / Guru
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-4">
                Untuk memastikan anak belajar dengan nyaman, silakan jawab pertanyaan berikut:
              </p>

              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 mb-4">
                <span className="text-sm font-extrabold text-sky-900">
                  Berapakah hasil dari: 3 + 4 = ?
                </span>
              </div>

              <div className="flex gap-2 justify-center">
                <input
                  type="number"
                  value={parentPasscodeInput}
                  onChange={(e) => setParentPasscodeInput(e.target.value)}
                  placeholder="Ketik angka..."
                  className="w-32 px-3 py-2 text-center rounded-xl border-2 border-slate-300 font-bold text-base focus:border-sky-500 focus:outline-hidden"
                />
                <button
                  onClick={handleUnlockParentGate}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Buka Kunci
                </button>
              </div>

              {passcodeError && (
                <p className="text-xs text-rose-500 font-bold mt-2">
                  {passcodeError}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-black text-slate-800">
                    Laporan Tumbuh Kembang Literasi
                  </h3>
                  <p className="text-xs text-slate-500">
                    Evaluasi positif tanpa perbandingan, dirancang untuk mendukung perkembangan anak usia dini.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Mode Aman Orang Tua Aktif</span>
                </div>
              </div>

              {/* Progress Summary Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Detail Capaian Materi
                  </span>
                  <div className="space-y-2 text-xs font-medium text-slate-700">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>Huruf Alfabet Dikenali:</span>
                      <span className="font-bold font-mono">{lettersLearnedCount} dari 26</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>Suku Kata Dikuasai:</span>
                      <span className="font-bold font-mono">{syllablesLearnedCount} suku kata</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>Total Kata yang Dibaca:</span>
                      <span className="font-bold font-mono">{progress.wordsReadCount} kata</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>Sesi Menulis di Kanvas:</span>
                      <span className="font-bold font-mono">{writingCount} sesi</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">
                    Catatan Positif untuk Pendamping
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Anak menunjukkan antusiasme yang baik dalam mengeksplorasi huruf dan bunyi suara. Hindari memaksakan kecepatan membaca; utamakan apresiasi terhadap keberanian mencoba dan rasa ingin tahu anak.
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => {
                        soundManager.playPop();
                        onOpenBreakModal();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Ingatkan Istirahat (Break Timer)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Reset Progress Section */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-black text-rose-900">
                    Mulai Ulang Petualangan (Reset Progres)
                  </h4>
                  <p className="text-xs text-rose-700">
                    Gunakan tombol ini jika ingin mengulang semua materi dan bintang dari awal.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Apakah Ayah/Bunda yakin ingin mengatur ulang data petualangan anak?')) {
                      soundManager.playPop();
                      onResetProgress();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Progres Belajar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
