import { UserProgress, Medal } from '../types/game';

const STORAGE_KEY = 'petualangan_pintar_progress_v1';

export const INITIAL_PROGRESS: UserProgress = {
  stars: 3,
  coins: 15,
  activeMascot: 'cici',
  activeAccessory: undefined,
  activeTheme: 'rainbow',
  unlockedItems: ['mascot_cici', 'theme_rainbow'],
  lettersLearned: ['A', 'I', 'U'],
  syllablesLearned: ['BA', 'BU', 'BI'],
  wordsReadCount: 4,
  sentencesReadCount: 2,
  writingCompleted: ['line_straight', 'line_curve'],
  quizzesCompletedCount: 2,
  storiesCompleted: [],
  learningSessionMinutes: 8,
  lastSessionDate: new Date().toISOString().split('T')[0],
  streakDays: 1,
};

export const MEDALS_CONFIG: Medal[] = [
  {
    id: 'medal_huruf',
    title: 'Penjelajah Huruf',
    description: 'Mengenal 10 huruf alfabet.',
    icon: '🔤',
    requirement: 'Kenali minimal 10 huruf',
    unlocked: false,
  },
  {
    id: 'medal_suku_kata',
    title: 'Bintang Suku Kata',
    description: 'Menguasai 10 suku kata.',
    icon: '⭐',
    requirement: 'Kuasai minimal 10 suku kata',
    unlocked: false,
  },
  {
    id: 'medal_pembaca',
    title: 'Pembaca Cilik Hebat',
    description: 'Membaca lebih dari 10 kata.',
    icon: '📖',
    requirement: 'Baca 10 kata di game membaca',
    unlocked: false,
  },
  {
    id: 'medal_penulis',
    title: 'Jagoan Menulis',
    description: 'Menyelesaikan 5 latihan menulis di kanvas.',
    icon: '✏️',
    requirement: 'Selesaikan 5 latihan menulis',
    unlocked: false,
  },
  {
    id: 'medal_tebak_gambar',
    title: 'Detektif Gambar',
    description: 'Menjawab 5 tebak gambar dengan benar.',
    icon: '🔍',
    requirement: 'Jawab tebak gambar 5 kali',
    unlocked: false,
  },
  {
    id: 'medal_penyusun_kata',
    title: 'Ahli Susun Kata',
    description: 'Menyusun 5 kata dengan benar.',
    icon: '🧩',
    requirement: 'Susun kata 5 kali',
    unlocked: false,
  },
  {
    id: 'medal_kolektor_bintang',
    title: 'Raja Bintang',
    description: 'Mengumpulkan lebih dari 25 bintang prestasi.',
    icon: '👑',
    requirement: 'Kumpulkan 25 bintang',
    unlocked: false,
  },
];

export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_PROGRESS, ...parsed };
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage errors
  }
}

export function evaluateMedals(progress: UserProgress): Medal[] {
  return MEDALS_CONFIG.map((medal) => {
    let unlocked = false;
    switch (medal.id) {
      case 'medal_huruf':
        unlocked = (progress.lettersLearned?.length || 0) >= 10;
        break;
      case 'medal_suku_kata':
        unlocked = (progress.syllablesLearned?.length || 0) >= 10;
        break;
      case 'medal_pembaca':
        unlocked = (progress.wordsReadCount || 0) >= 10;
        break;
      case 'medal_penulis':
        unlocked = (progress.writingCompleted?.length || 0) >= 5;
        break;
      case 'medal_tebak_gambar':
        unlocked = (progress.quizzesCompletedCount || 0) >= 5;
        break;
      case 'medal_penyusun_kata':
        unlocked = (progress.wordsReadCount || 0) >= 5;
        break;
      case 'medal_kolektor_bintang':
        unlocked = (progress.stars || 0) >= 25;
        break;
      default:
        unlocked = false;
    }
    return { ...medal, unlocked };
  });
}
