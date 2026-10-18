import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Share2,
  PlusSquare,
  CheckCircle2,
  X,
  Sparkles,
  Info,
  ExternalLink,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundManager } from '../utils/audio';

interface PWAInstallBannerProps {
  onInstalled?: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onInstalled }) => {
  const { isInstallable, isInstalled, isIOS, isMobile, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  // Auto-prompt on initial mobile arrival after 1.5 seconds if installable
  useEffect(() => {
    if (isInstalled) return;

    const hasDismissed = sessionStorage.getItem('pwa_prompt_dismissed');
    if (hasDismissed === 'true') {
      setDismissed(true);
    }
  }, [isInstalled]);

  // If already installed as a standalone app, do not show any install banners
  if (isInstalled || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    soundManager.playPop();

    if (isInstallable) {
      const success = await install();
      if (success) {
        soundManager.playFanfare();
        soundManager.speak('Aplikasi berhasil dipasang di HP! Selamat bermain!');
        if (onInstalled) onInstalled();
      }
    } else {
      // If beforeinstallprompt hasn't fired yet or browser is iOS / non-Chromium
      setShowGuideModal(true);
    }
  };

  const handleDismiss = () => {
    soundManager.playPop();
    setDismissed(true);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  return (
    <>
      {/* Floating Smart Banner on Mobile & Desktop */}
      <div className="fixed bottom-4 inset-x-4 max-w-xl mx-auto z-50 animate-in slide-in-from-bottom-5 duration-300">
        <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-2xl border-2 border-emerald-400 text-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Close / Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center border border-slate-300 shadow-md cursor-pointer transition-colors"
            title="Tutup sementara"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shrink-0 flex items-center justify-center">
              <img
                src="/icon.svg"
                alt="Petualangan Pintar Logo"
                className="w-13 h-13 rounded-2xl object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight leading-tight block">
                  Pasang di HP Kamu! 📱
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-100 text-emerald-800">
                  Gratis
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                Pasang langsung ke layar utama HP agar cepat dibuka tanpa browser!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={handleInstallClick}
              className="flex-1 sm:flex-none py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
            >
              <Download className="w-4 h-4 animate-bounce" />
              <span>{isInstallable ? 'Pasang di HP Sekarang' : 'Cara Pasang di HP'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guide Modal for iOS or manual install */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-4 border-emerald-300 relative text-left">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Smartphone className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-slate-900">
              Cara Pasang di Layar Utama HP
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Ikuti 2 langkah mudah berikut agar ikon game muncul di HP Anda:
            </p>

            {isIOS ? (
              /* iOS Safari Instructions */
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-black text-sm">
                    1
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Tekan tombol Bagikan</span>
                      <Share2 className="w-3.5 h-3.5 text-blue-600 inline" />
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Di bilah bawah browser Safari iPhone/iPad Anda, sentuh ikon kotak dengan panah ke atas (Share).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-black text-sm">
                    2
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Pilih &ldquo;Tambah ke Layar Utama&rdquo;</span>
                      <PlusSquare className="w-3.5 h-3.5 text-emerald-600 inline" />
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Gulir ke bawah pada menu, lalu sentuh <strong>&ldquo;Tambah ke Layar Utama&rdquo;</strong> (Add to Home Screen).
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Android / Chrome / Edge Instructions */
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-black text-sm">
                    1
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Tekan Titik Tiga (⋮) di Pojok Kanan Atas
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Buka menu browser Chrome atau browser bawaan HP Anda.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-black text-sm">
                    2
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Pilih &ldquo;Instal Aplikasi&rdquo; atau &ldquo;Tambahkan ke Layar Utama&rdquo;</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Game akan terpasang otomatis seperti aplikasi Play Store dan siap dimainkan kapan saja!
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuideModal(false)}
              className="mt-5 w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer text-center"
            >
              Saya Mengerti, Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const PWAHeaderInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already installed, hide header button
  if (isInstalled) return null;

  const handleClick = async () => {
    soundManager.playPop();
    if (isInstallable) {
      await install();
    } else {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-black text-xs transition-all shadow-xs cursor-pointer active:scale-95"
        title="Pasang Game di HP"
      >
        <Smartphone className="w-4 h-4 animate-bounce" />
        <span className="hidden sm:inline">Pasang di HP</span>
      </button>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-4 border-amber-300">
            <h3 className="text-lg font-black text-slate-900">
              Pasang Game di HP 📱
            </h3>
            <p className="text-xs text-slate-600 mt-2">
              {isIOS ? (
                <>
                  1. Sentuh ikon <strong>Bagikan / Share (⎋)</strong> di Safari.<br />
                  2. Pilih <strong>&ldquo;Tambah ke Layar Utama&rdquo; (⊞)</strong>.
                </>
              ) : (
                <>
                  1. Sentuh menu titik tiga <strong>(⋮)</strong> di browser.<br />
                  2. Pilih <strong>&ldquo;Instal Aplikasi&rdquo;</strong> atau <strong>&ldquo;Tambahkan ke Layar Utama&rdquo;</strong>.
                </>
              )}
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};
