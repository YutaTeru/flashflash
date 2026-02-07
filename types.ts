export interface Flashcard {
  id: string;
  english: string;
  japanese: string;
  category: string;
  isFavorite: boolean;
}

export type QuizState = 'idle' | 'playing' | 'result';

export type AppMode = 'study' | 'quiz' | 'manage' | 'settings' | 'list';

export interface QuizResult {
  total: number;
  correct: number;
  score: number;
  rank: string;
}