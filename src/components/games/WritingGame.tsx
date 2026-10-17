import React, { useRef, useState, useEffect } from 'react';
import {
  RotateCcw,
  Check,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Palette,
  Volume2,
  Brush,
} from 'lucide-react';
import { Mascot, TracingItem, UserProgress } from '../../types/game';
import { TRACING_ITEMS } from '../../data/learningData';
import { soundManager } from '../../utils/audio';
import { MascotCompanion } from '../MascotCompanion';

interface WritingGameProps {
  activeMascot: Mascot;
  progress: UserProgress;
  onEarnReward: (stars: number, coins: number, writingId?: string) => void;
  onBackToMenu: () => void;
}

const COLORS = [
  { name: 'Biru Ceria', value: '#2563eb' },
  { name: 'Merah Berani', value: '#e11d48' },
  { name: 'Hijau Segar', value: '#16a34a' },
  { name: 'Oranye Hangat', value: '#ea580c' },
  { name: 'Ungu Manis', value: '#9333ea' },
];

export const WritingGame: React.FC<WritingGameProps> = ({
  activeMascot,
  progress,
  onEarnReward,
  onBackToMenu,
}) => {
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>('#2563eb');
  const [brushSize, setBrushSize] = useState<number>(14);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [evaluated, setEvaluated] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentItem: TracingItem = TRACING_ITEMS[currentItemIndex];

  const [mascotSpeech, setMascotSpeech] = useState<string>(
    `Ayo tebalkan ${currentItem.label} mengikuti garis putus-putus!`
  );

  // Redraw guide overlay whenever item changes
  useEffect(() => {
    resetCanvas();
    const speech = `Mari menulis ${currentItem.label}! ${currentItem.guideText}`;
    setMascotSpeech(speech);
    soundManager.speak(speech);
  }, [currentItemIndex]);

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setEvaluated(false);
  };

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleStartDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const handleDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleEndDraw = () => {
    setIsDrawing(false);
  };

  const handleFinishWriting = () => {
    soundManager.playCorrect();
    setEvaluated(true);
    const praises = activeMascot.praisePhrases;
    const praise = praises[Math.floor(Math.random() * praises.length)];
    const feedback = `${praise}! Goresan tulisanmu sangat bagus dan rapi!`;
    setMascotSpeech(feedback);
    soundManager.speak(feedback);
    onEarnReward(1, 3, currentItem.id);
  };

  const handleNextItem = () => {
    soundManager.playPop();
    const nextIdx = (currentItemIndex + 1) % TRACING_ITEMS.length;
    setCurrentItemIndex(nextIdx);
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

        {/* Item Selector Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          {TRACING_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                soundManager.playPop();
                setCurrentItemIndex(idx);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                currentItemIndex === idx
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mascot Companion Speaking */}
      <MascotCompanion mascot={activeMascot} speechText={mascotSpeech} />

      {/* Writing Canvas Board */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-200 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Kanvas Menulis Interaktif
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">
              {currentItem.label}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {currentItem.guideText}
            </p>
          </div>

          {/* Color & Brush Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedColor(c.value);
                  }}
                  className={`w-7 h-7 rounded-lg transition-transform cursor-pointer ${
                    selectedColor === c.value
                      ? 'scale-125 ring-2 ring-slate-800 shadow-xs'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>

            {/* Brush Size Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => {
                  soundManager.playPop();
                  setBrushSize(8);
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                  brushSize === 8 ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                }`}
              >
                Kecil
              </button>
              <button
                onClick={() => {
                  soundManager.playPop();
                  setBrushSize(14);
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                  brushSize === 14 ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                }`}
              >
                Sedang
              </button>
              <button
                onClick={() => {
                  soundManager.playPop();
                  setBrushSize(22);
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                  brushSize === 22 ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                }`}
              >
                Tebal
              </button>
            </div>
          </div>
        </div>

        {/* Tracing Canvas Area */}
        <div className="relative max-w-md mx-auto aspect-square rounded-3xl overflow-hidden border-4 border-dashed border-emerald-300 bg-amber-50/30 touch-none shadow-inner flex items-center justify-center">
          {/* SVG Dotted Guide Lines in the Background */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 300 300"
          >
            {/* Guide Grid lines */}
            <line
              x1="20"
              y1="50"
              x2="280"
              y2="50"
              stroke="#e2e8f0"
              strokeDasharray="4 4"
            />
            <line
              x1="20"
              y1="150"
              x2="280"
              y2="150"
              stroke="#cbd5e1"
              strokeDasharray="6 6"
            />
            <line
              x1="20"
              y1="250"
              x2="280"
              y2="250"
              stroke="#e2e8f0"
              strokeDasharray="4 4"
            />

            {/* Dotted Stroke Guide */}
            {currentItem.strokes.map((stroke, sIdx) => {
              const pathData = stroke.points
                .map((pt, pIdx) => (pIdx === 0 ? `M ${pt.x} ${pt.y}` : `L ${pt.x} ${pt.y}`))
                .join(' ');

              const startPoint = stroke.points[0];

              return (
                <g key={sIdx}>
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="8 12"
                    opacity="0.4"
                  />
                  {/* Start Point indicator with number */}
                  {startPoint && (
                    <circle
                      cx={startPoint.x}
                      cy={startPoint.y}
                      r="10"
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  )}
                  {startPoint && (
                    <text
                      x={startPoint.x}
                      y={startPoint.y + 4}
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {sIdx + 1}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive User Drawing Canvas */}
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            onMouseDown={handleStartDraw}
            onMouseMove={handleDraw}
            onMouseUp={handleEndDraw}
            onMouseLeave={handleEndDraw}
            onTouchStart={handleStartDraw}
            onTouchMove={handleDraw}
            onTouchEnd={handleEndDraw}
            className="absolute inset-0 w-full h-full cursor-crosshair z-10"
          />

          {/* Guide Watermark Hint */}
          {!hasDrawn && (
            <div className="pointer-events-none absolute bottom-4 inset-x-0 text-center">
              <span className="px-3 py-1 rounded-full bg-white/90 text-emerald-800 text-xs font-bold shadow-xs">
                ✍️ Gunakan jari atau mouse untuk menebalkan
              </span>
            </div>
          )}
        </div>

        {/* Feedback Message */}
        {evaluated && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in fade-in">
            <span className="text-sm font-black text-emerald-800">
              🌟 Bagus sekali! Tulisanmu semakin rapi dan hebat!
            </span>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              soundManager.playPop();
              resetCanvas();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Hapus / Ulangi</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFinishWriting}
              disabled={!hasDrawn}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs shadow-md transition-all cursor-pointer ${
                hasDrawn
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Selesai Menulis!</span>
            </button>

            <button
              onClick={handleNextItem}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>Latihan Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
