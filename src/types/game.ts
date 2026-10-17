export type MascotId = 'cici' | 'mimi' | 'bobi';

export interface Mascot {
  id: MascotId;
  name: string;
  species: string;
  title: string;
  image: string;
  color: string;
  bgGradient: string;
  greeting: string;
  praisePhrases: string[];
  encouragePhrases: string[];
}

export type GameMenu =
  | 'menu'
  | 'alphabet'
  | 'syllables'
  | 'reading'
  | 'writing'
  | 'picture_guess'
  | 'word_builder'
  | 'story'
  | 'rewards'
  | 'progress';

export interface LetterData {
  letter: string;
  isVowel: boolean;
  word: string;
  syllables: string;
  exampleSentence: string;
  iconSvg: string;
  color: string;
}

export interface SyllableGroup {
  consonant: string;
  items: string[];
  exampleWords: { word: string; parts: string[]; meaning: string; icon: string }[];
}

export interface ReadingSentence {
  id: string;
  level: number;
  text: string;
  parts: string[];
  imageIcon: string;
  description: string;
}

export interface TracingStroke {
  points: { x: number; y: number }[];
  instruction?: string;
}

export interface TracingItem {
  id: string;
  type: 'line' | 'curve' | 'letter_upper' | 'letter_lower' | 'syllable' | 'word';
  label: string;
  guideText: string;
  strokes: TracingStroke[];
  hint: string;
}

export interface PictureGuessItem {
  id: string;
  category: 'hewan' | 'buah' | 'rumah' | 'sekolah';
  categoryLabel: string;
  imageUrl: string;
  correctWord: string;
  options: string[];
  hint: string;
}

export interface WordBuilderItem {
  id: string;
  word: string;
  displayHint: string;
  category: string;
  icon: string;
  letters: string[];
  length: number;
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  sentenceWords: string[];
  illustrationScene: string;
  sceneColor: string;
  interactiveItem?: { label: string; sound: string; description: string };
}

export interface StoryBook {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  summary: string;
  pages: StoryPage[];
  quizQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
  };
}

export interface RewardItem {
  id: string;
  name: string;
  type: 'mascot' | 'accessory' | 'background';
  cost: number;
  unlocked: boolean;
  icon: string;
  description: string;
}

export interface Medal {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export interface UserProgress {
  stars: number;
  coins: number;
  activeMascot: MascotId;
  activeAccessory?: string;
  activeTheme?: string;
  unlockedItems: string[];
  lettersLearned: string[];
  syllablesLearned: string[];
  wordsReadCount: number;
  sentencesReadCount: number;
  writingCompleted: string[];
  quizzesCompletedCount: number;
  storiesCompleted: string[];
  learningSessionMinutes: number;
  lastSessionDate: string;
  streakDays: number;
}
