import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  BrainCircuit, 
  Settings, 
  Moon, 
  Sun, 
  Search, 
  Plus, 
  Trash2, 
  Edit2, 
  Star, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  Shuffle,
  Languages,
  CheckCircle,
  XCircle,
  RefreshCw,
  ListOrdered,
  LayoutGrid,
  MoveRight,
  List,
  Eye,
  EyeOff,
  Type,
  Filter,
  ArrowDownUp
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

import { Flashcard, AppMode, QuizState } from './types';
import { INITIAL_DATA } from './utils/initialData';
import { Button } from './components/Button';

// --- Sub-components ---

// 1. Navbar
const Navbar: React.FC<{
  mode: AppMode;
  setMode: (m: AppMode) => void;
  isDark: boolean;
  toggleTheme: () => void;
}> = ({ mode, setMode, isDark, toggleTheme }) => (
  <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div 
          className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform" 
          onClick={() => setMode('study')}
        >
          <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
            単語マスター
          </span>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <NavButton 
            active={mode === 'study'} 
            onClick={() => setMode('study')} 
            icon={<BookOpen size={20} />} 
            label="学習" 
          />
          <NavButton 
            active={mode === 'list'} 
            onClick={() => setMode('list')} 
            icon={<List size={20} />} 
            label="一覧" 
          />
          <NavButton 
            active={mode === 'quiz'} 
            onClick={() => setMode('quiz')} 
            icon={<BrainCircuit size={20} />} 
            label="クイズ" 
          />
          <NavButton 
            active={mode === 'manage'} 
            onClick={() => setMode('manage')} 
            icon={<Settings size={20} />} 
            label="管理" 
          />
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 sm:mx-2" />
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors active:scale-90"
            aria-label="テーマ切替"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </div>
  </nav>
);

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95 ${
      active 
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' 
        : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

// 2. Study Mode
const StudyMode: React.FC<{
  cards: Flashcard[];
  toggleFavorite: (id: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (v: boolean) => void;
}> = ({ cards, toggleFavorite, showFavoritesOnly, setShowFavoritesOnly }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReverse, setIsReverse] = useState(false);
  const [studyDeck, setStudyDeck] = useState<Flashcard[]>([]);

  // Initialize deck based on filter
  useEffect(() => {
    let filtered = showFavoritesOnly ? cards.filter(c => c.isFavorite) : cards;
    if (filtered.length === 0 && showFavoritesOnly) {
       filtered = []; 
    }
    setStudyDeck(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cards, showFavoritesOnly]);

  const currentCard = studyDeck[currentIndex];

  const handleNext = () => {
    if (currentIndex < studyDeck.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleShuffle = () => {
    setStudyDeck(prev => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleFlip = () => setIsFlipped(!isFlipped);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, studyDeck.length]);

  if (studyDeck.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-full mb-6 animate-pulse">
          <BookOpen className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">カードが見つかりません</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6 text-lg">
          {showFavoritesOnly 
            ? "お気に入りがまだありません。カードにスターをつけてみましょう！" 
            : "デッキが空です。管理画面でカードを追加してください。"}
        </p>
        {showFavoritesOnly && (
           <Button variant="outline" onClick={() => setShowFavoritesOnly(false)}>
             すべてのカードを表示
           </Button>
        )}
      </div>
    );
  }

  // Ensure text isn't undefined or empty string, fallback to placeholder
  const getDisplayText = (text: string | undefined) => {
      if (!text || text.trim() === '') return "(テキストなし)";
      return text;
  };

  const frontText = getDisplayText(isReverse ? currentCard?.japanese : currentCard?.english);
  const backText = getDisplayText(isReverse ? currentCard?.english : currentCard?.japanese);
  const frontLang = isReverse ? "日本語" : "英語";
  const backLang = isReverse ? "英語" : "日本語";

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-80px)] sm:h-auto justify-start sm:justify-center gap-6">
      
      {/* Controls */}
      <div className="w-full flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
           <button 
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`p-2.5 rounded-xl transition-colors active:scale-95 ${showFavoritesOnly ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
           >
             <Star className={showFavoritesOnly ? "fill-current" : ""} size={22} />
           </button>
           <span className="text-sm font-bold text-gray-500 dark:text-gray-400 tabular-nums">
             {currentIndex + 1} / {studyDeck.length}
           </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
             onClick={() => setIsReverse(!isReverse)}
             className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg active:scale-95"
          >
            <Languages size={16} />
            {isReverse ? '日 → 英' : '英 → 日'}
          </button>
          <button 
            onClick={handleShuffle}
            className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl active:scale-95 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Shuffle size={20} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex + 1) / studyDeck.length) * 100}%` }}
        />
      </div>

      {/* Card Area - Fixed Layout to prevent collapsing */}
      <div className="w-full perspective-[1000px] h-[400px]">
        <div 
          className="relative w-full h-full cursor-pointer [transform-style:preserve-3d]"
          style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          onClick={handleFlip}
        >
          {/* Front */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white dark:bg-gray-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border-2 border-gray-100 dark:border-gray-700 flex flex-col">
            
            {/* Header (Fixed Height) */}
            <div className="flex-none h-14 px-6 flex justify-between items-center">
                <span className="text-xs font-extrabold tracking-widest text-gray-300 dark:text-gray-600 uppercase">{frontLang}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(currentCard.id); }}
                  className="p-1 -mr-2 text-gray-300 hover:text-yellow-400 active:scale-110 transition-all"
                >
                  <Star size={28} className={currentCard.isFavorite ? "fill-yellow-400 text-yellow-400" : ""} />
                </button>
            </div>
            
            {/* Main Content (Flexible Height) - Simplified to Grid for absolute centering */}
            <div className="flex-1 w-full overflow-y-auto px-6 py-2 flex flex-col justify-center items-center">
                 <p className="text-center text-xl sm:text-2xl md:text-3xl font-bold leading-relaxed text-gray-900 dark:text-white select-none whitespace-pre-wrap break-words w-full">
                   {frontText}
                 </p>
            </div>
            
            {/* Footer (Fixed Height) */}
            <div className="flex-none h-16 flex flex-col justify-center items-center text-xs font-semibold text-gray-400 gap-1 pb-4">
               <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-500 dark:text-gray-300 max-w-[80%] truncate">{currentCard.category}</span>
               <span className="opacity-50 text-[10px] uppercase tracking-wider">タップで裏返す</span>
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-blue-50 dark:bg-gray-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border-2 border-blue-200 dark:border-gray-600 flex flex-col">
             <div className="flex-none h-14 px-6 flex justify-between items-center">
                <span className="text-xs font-extrabold tracking-widest text-blue-400 uppercase">{backLang}</span>
                <div className="w-8"></div> {/* Spacer for symmetry */}
            </div>
            
            <div className="flex-1 w-full overflow-y-auto px-6 py-2 flex flex-col justify-center items-center">
                 <p className="text-center text-xl sm:text-2xl md:text-3xl font-bold leading-relaxed text-gray-800 dark:text-gray-100 select-none whitespace-pre-wrap break-words w-full">
                   {backText}
                 </p>
            </div>

            <div className="flex-none h-16"></div> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      {/* Nav Buttons */}
      <div className="grid grid-cols-2 gap-4 w-full mt-auto sm:mt-0">
        <Button 
          variant="outline" 
          size="lg"
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="w-full h-14 text-lg font-bold"
        >
          <ArrowLeft size={24} className="mr-2" /> 前へ
        </Button>
        <Button 
          variant="primary" 
          size="lg"
          onClick={handleNext} 
          disabled={currentIndex === studyDeck.length - 1}
          className="w-full h-14 text-lg font-bold shadow-lg shadow-blue-500/20"
        >
          次へ <ArrowRight size={24} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

// 3. List Mode
const ListMode: React.FC<{
  cards: Flashcard[];
  toggleFavorite: (id: string) => void;
}> = ({ cards, toggleFavorite }) => {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // Range State
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(10);
  
  // Shuffle State
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

  // Red Text / Red Sheet State
  const [targetSide, setTargetSide] = useState<'english' | 'japanese'>('japanese');
  const [isRedTextEnabled, setIsRedTextEnabled] = useState(false);
  const [isRedSheetActive, setIsRedSheetActive] = useState(false);
  
  // Track temporarily revealed cards (Red sheet peek)
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  // Base list based on filter
  const baseCards = useMemo(() => {
    return showFavoritesOnly ? cards.filter(c => c.isFavorite) : cards;
  }, [cards, showFavoritesOnly]);

  // Update shuffle indices when base cards change or shuffle is toggled
  useEffect(() => {
    if (isShuffled) {
      const indices = Array.from({ length: baseCards.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setShuffledIndices(indices);
    } else {
      setShuffledIndices([]);
    }
  }, [baseCards.length, isShuffled, showFavoritesOnly]);

  // Determine final display list
  const displayCards = useMemo(() => {
    let currentList = baseCards;
    
    // Apply shuffle if active
    if (isShuffled && shuffledIndices.length === baseCards.length) {
      currentList = shuffledIndices.map(i => baseCards[i]);
    }

    // Apply Range
    // Validate range
    const start = Math.max(1, rangeStart) - 1; // 0-based index
    const end = Math.max(start + 1, rangeEnd);
    
    return currentList.slice(start, end);
  }, [baseCards, isShuffled, shuffledIndices, rangeStart, rangeEnd]);

  // Handle Red Sheet Peek
  const toggleReveal = (id: string) => {
    if (!isRedSheetActive) return;
    
    setRevealedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Clear revealed IDs when sheet is turned off
  useEffect(() => {
    if (!isRedSheetActive) {
      setRevealedIds(new Set());
    }
  }, [isRedSheetActive]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      {/* Top Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        
        {/* Left: Range & Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Range Input */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <input 
                  type="number" 
                  min={1}
                  value={rangeStart}
                  onChange={(e) => setRangeStart(Number(e.target.value))}
                  className="w-12 text-center bg-transparent border-none focus:ring-0 p-1 text-sm font-bold font-mono"
                />
                <span className="text-gray-400 px-1">~</span>
                <input 
                  type="number" 
                  min={rangeStart}
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(Number(e.target.value))}
                  className="w-12 text-center bg-transparent border-none focus:ring-0 p-1 text-sm font-bold font-mono"
                />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`p-2.5 rounded-lg transition-colors border ${showFavoritesOnly ? 'bg-yellow-50 border-yellow-200 text-yellow-600 dark:bg-yellow-900/20 dark:border-yellow-800' : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-500'}`}
              title="お気に入りのみ表示"
            >
              <Filter size={18} className={showFavoritesOnly ? "fill-current" : ""} />
            </button>
            
            {/* Shuffle Toggle */}
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className={`p-2.5 rounded-lg transition-colors border ${isShuffled ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-500'}`}
              title="シャッフル"
            >
              {isShuffled ? <Shuffle size={18} /> : <ArrowDownUp size={18} />}
            </button>
        </div>

        {/* Right: Red Text / Sheet Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
             {/* Target Toggle */}
             <button
                onClick={() => setTargetSide(prev => prev === 'japanese' ? 'english' : 'japanese')}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
             >
                <Languages size={14} />
                対象: {targetSide === 'japanese' ? '日本語' : '英語'}
             </button>

             <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden lg:block" />

             {/* Red Text Toggle */}
             <button
                onClick={() => setIsRedTextEnabled(!isRedTextEnabled)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all border ${
                  isRedTextEnabled 
                  ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300' 
                  : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
             >
                <Type size={16} />
                赤文字
             </button>

             {/* Red Sheet Toggle */}
             <button
                onClick={() => setIsRedSheetActive(!isRedSheetActive)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all border ${
                  isRedSheetActive 
                  ? 'bg-gray-800 text-white border-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:border-gray-100 shadow-md' 
                  : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
             >
                {isRedSheetActive ? <EyeOff size={16} /> : <Eye size={16} />}
                赤シート
             </button>
        </div>
      </div>

      {/* List Content */}
      <div className="space-y-3">
        {displayCards.length === 0 ? (
           <div className="text-center py-20 text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
             <List size={40} className="mx-auto mb-3 opacity-20" />
             <p>表示するカードがありません</p>
           </div>
        ) : (
          displayCards.map((card, index) => {
            // Calculate actual 1-based index relative to the sliced view
            const displayIndex = (Math.max(1, rangeStart)) + index;
            
            // Text Styles based on Red Text / Sheet settings
            const getTextStyle = (side: 'english' | 'japanese', cardId: string) => {
               if (targetSide !== side) return "text-gray-900 dark:text-gray-100"; // Normal if not target
               
               if (!isRedTextEnabled) return "text-gray-900 dark:text-gray-100"; // Normal if red mode off

               // If Red Mode is ON for this side:
               if (isRedSheetActive) {
                  // If temporarily revealed by tap
                  if (revealedIds.has(cardId)) {
                      return "text-red-500 dark:text-red-400 font-bold transition-colors duration-300 cursor-pointer";
                  }
                  // Hidden state
                  return "bg-red-100/80 dark:bg-red-900/50 text-transparent select-none rounded px-1 cursor-pointer hover:bg-red-200/80 dark:hover:bg-red-900/70 transition-colors"; 
               }
               
               // Red Text mode (Sheet off)
               return "text-red-500 dark:text-red-400 font-bold transition-colors duration-300"; 
            };

            return (
              <div key={card.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-start md:items-center hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                 
                 {/* Index Badge */}
                 <div className="flex-none hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-500">
                    {displayIndex}
                 </div>

                 <div className="flex-1 grid md:grid-cols-2 gap-4 w-full">
                    {/* English Column */}
                    <div className="flex flex-col justify-center">
                        <span className="text-xs text-gray-400 mb-1 md:hidden">英語</span>
                        <p 
                            onClick={() => targetSide === 'english' && toggleReveal(card.id)}
                            className={`text-lg font-bold leading-snug ${getTextStyle('english', card.id)}`}
                        >
                           {card.english}
                        </p>
                    </div>

                    {/* Japanese Column */}
                    <div className="flex flex-col justify-center md:border-l md:border-gray-100 dark:md:border-gray-700 md:pl-4">
                        <span className="text-xs text-gray-400 mb-1 md:hidden">日本語</span>
                        <p 
                            onClick={() => targetSide === 'japanese' && toggleReveal(card.id)}
                            className={`text-base font-medium leading-snug ${getTextStyle('japanese', card.id)}`}
                        >
                           {card.japanese}
                        </p>
                    </div>
                 </div>

                 {/* Action */}
                 <button 
                    onClick={() => toggleFavorite(card.id)}
                    className="flex-none p-2 text-gray-300 hover:text-yellow-400 transition-colors self-end md:self-center"
                  >
                    <Star size={20} className={card.isFavorite ? "fill-yellow-400 text-yellow-400" : ""} />
                 </button>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 text-center text-xs text-gray-400">
         全 {baseCards.length} 件
      </div>
    </div>
  );
};

// 4. Quiz Mode
const QuizMode: React.FC<{
  cards: Flashcard[];
  toggleFavorite: (id: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (v: boolean) => void;
}> = ({ cards, toggleFavorite, showFavoritesOnly, setShowFavoritesOnly }) => {
  // Settings State
  const [quizType, setQuizType] = useState<'choice' | 'scramble'>('choice');
  const [quizOrder, setQuizOrder] = useState<'random' | 'sequential'>('random');

  const [gameState, setGameState] = useState<QuizState>('idle');
  const [quizDeck, setQuizDeck] = useState<Flashcard[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  // 4-Choice Specific State
  const [options, setOptions] = useState<Flashcard[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Scramble Specific State
  const [scrambleShuffled, setScrambleShuffled] = useState<{id: string, text: string, used: boolean}[]>([]);
  const [scrambleSelected, setScrambleSelected] = useState<{id: string, text: string}[]>([]);
  const [scrambleResult, setScrambleResult] = useState<'correct' | 'incorrect' | null>(null);

  // Initialize Quiz
  const startQuiz = () => {
    let deck = showFavoritesOnly ? cards.filter(c => c.isFavorite) : [...cards];
    if (deck.length < 1) {
      alert("この条件に合うカードがありません！");
      return;
    }
    
    if (quizType === 'choice' && cards.length < 4) {
      alert("4択クイズを始めるには、少なくとも4枚のカードが必要です！");
      return;
    }

    if (quizOrder === 'random') {
        deck = deck.sort(() => Math.random() - 0.5);
    }
    
    setQuizDeck(deck);
    setScore(0);
    setCurrentQuestionIndex(0);
    setGameState('playing');
    
    if (quizType === 'choice') {
        generateChoiceOptions(deck[0]);
    } else {
        generateScramble(deck[0]);
    }
  };

  const generateChoiceOptions = (correctCard: Flashcard) => {
    const distractors = cards
      .filter(c => c.id !== correctCard.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const allOptions = [correctCard, ...distractors].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setSelectedOptionId(null);
  };

  const generateScramble = (card: Flashcard) => {
    const words = card.english.trim().split(/\s+/);
    const shuffled = words.map((w, i) => ({ id: `${i}-${w}`, text: w, used: false }))
      .sort(() => Math.random() - 0.5);
    
    setScrambleShuffled(shuffled);
    setScrambleSelected([]);
    setScrambleResult(null);
  };

  const handleNextQuestion = () => {
      if (currentQuestionIndex < quizDeck.length - 1) {
        const nextIdx = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIdx);
        if (quizType === 'choice') {
            generateChoiceOptions(quizDeck[nextIdx]);
        } else {
            generateScramble(quizDeck[nextIdx]);
        }
      } else {
        setGameState('result');
      }
  };

  const handleOptionClick = (optionId: string) => {
    if (selectedOptionId) return;
    
    setSelectedOptionId(optionId);
    const correctId = quizDeck[currentQuestionIndex].id;
    
    if (optionId === correctId) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
        handleNextQuestion();
    }, 1200);
  };

  const handleScrambleSelect = (item: {id: string, text: string, used: boolean}) => {
    if (item.used || scrambleResult) return;
    setScrambleShuffled(prev => prev.map(p => p.id === item.id ? { ...p, used: true } : p));
    setScrambleSelected(prev => [...prev, { id: item.id, text: item.text }]);
  };

  const handleScrambleDeselect = (item: {id: string, text: string}, index: number) => {
      if (scrambleResult) return;
      setScrambleSelected(prev => prev.filter((_, i) => i !== index));
      setScrambleShuffled(prev => prev.map(p => p.id === item.id ? { ...p, used: false } : p));
  };

  const checkScrambleAnswer = () => {
      const userAnswer = scrambleSelected.map(s => s.text).join(' ');
      const correctEnglish = quizDeck[currentQuestionIndex].english.trim();
      const originalWords = correctEnglish.split(/\s+/).join(' ');
      
      if (userAnswer === originalWords) {
          setScore(prev => prev + 1);
          setScrambleResult('correct');
      } else {
          setScrambleResult('incorrect');
      }

      setTimeout(() => {
          handleNextQuestion();
      }, 1500);
  };

  const getRank = (percentage: number) => {
    if (percentage === 100) return '全問正解！完璧です！🏆';
    if (percentage >= 80) return '素晴らしい！🌟';
    if (percentage >= 60) return 'よくできました！👍';
    return 'もう少し頑張ろう！💪';
  };

  if (gameState === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-6 text-center max-w-lg mx-auto">
        <div className="p-8 bg-blue-50 dark:bg-blue-900/20 rounded-full animate-bounce-slow ring-8 ring-blue-50/50 dark:ring-blue-900/10">
           <BrainCircuit className="w-16 h-16 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">クイズタイム</h2>
          <p className="text-gray-500 dark:text-gray-400">クイズの設定を選んでください。</p>
        </div>

        <div className="w-full space-y-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider text-left">出題範囲</label>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button 
                        onClick={() => setShowFavoritesOnly(false)}
                        className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${!showFavoritesOnly ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        すべて
                    </button>
                    <button 
                        onClick={() => setShowFavoritesOnly(true)}
                        className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${showFavoritesOnly ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        お気に入りのみ
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider text-left">出題順</label>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button 
                        onClick={() => setQuizOrder('random')}
                        className={`flex-1 py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${quizOrder === 'random' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        <Shuffle size={14} /> ランダム
                    </button>
                    <button 
                        onClick={() => setQuizOrder('sequential')}
                        className={`flex-1 py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${quizOrder === 'sequential' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                         <ListOrdered size={14} /> 順番通り
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider text-left">出題形式</label>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button 
                        onClick={() => setQuizType('choice')}
                        className={`flex-1 py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${quizType === 'choice' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        <LayoutGrid size={14} /> 4択クイズ
                    </button>
                    <button 
                        onClick={() => setQuizType('scramble')}
                        className={`flex-1 py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${quizType === 'scramble' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        <MoveRight size={14} /> 並び替え
                    </button>
                </div>
            </div>
        </div>
        
        <Button size="lg" onClick={startQuiz} className="w-full h-14 text-lg font-bold shadow-xl shadow-blue-500/20">
            クイズ開始
        </Button>
      </div>
    );
  }

  if (gameState === 'result') {
    const percentage = Math.round((score / quizDeck.length) * 100);
    const data = [
      { name: '正解', value: score, color: '#10b981' },
      { name: '不正解', value: quizDeck.length - score, color: '#ef4444' },
    ];

    return (
      <div className="max-w-md mx-auto py-12 px-4 flex flex-col items-center animate-in fade-in zoom-in duration-300">
        <h2 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white text-center">{getRank(percentage)}</h2>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 font-medium">スコア: {score} / {quizDeck.length}</p>

        <div className="w-full h-64 mb-8">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
            </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
             <Button onClick={() => setGameState('idle')} variant="outline" className="h-12 font-bold">
                メニュー
             </Button>
             <Button onClick={startQuiz} variant="primary" className="h-12 font-bold">
                リトライ <RotateCcw size={18} className="ml-2" />
             </Button>
        </div>
      </div>
    );
  }

  const currentCard = quizDeck[currentQuestionIndex];

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-80px)] sm:h-auto">
        <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                問 {currentQuestionIndex + 1} / {quizDeck.length}
            </span>
            <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                スコア: {score}
            </span>
        </div>
        
        <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-8 overflow-hidden">
            <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestionIndex) / quizDeck.length) * 100}%` }}
            />
        </div>

        {quizType === 'choice' ? (
            <>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border-2 border-gray-100 dark:border-gray-700 mb-6 text-center min-h-[180px] flex items-center justify-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 leading-relaxed">
                        {currentCard.english}
                    </h3>
                </div>

                <div className="grid gap-3 flex-1 overflow-y-auto pb-4">
                    {options.map((option) => {
                        const isSelected = selectedOptionId === option.id;
                        const isCorrect = option.id === currentCard.id;
                        
                        let buttonStyle = "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200";
                        let icon = null;

                        if (selectedOptionId) {
                            if (isCorrect) {
                                buttonStyle = "bg-green-100 dark:bg-green-900/30 border-2 border-green-500 text-green-800 dark:text-green-200";
                                icon = <CheckCircle size={24} className="text-green-600 flex-shrink-0" />;
                            } else if (isSelected) {
                                buttonStyle = "bg-red-100 dark:bg-red-900/30 border-2 border-red-500 text-red-800 dark:text-red-200";
                                icon = <XCircle size={24} className="text-red-600 flex-shrink-0" />;
                            } else {
                                buttonStyle = "opacity-40 grayscale border-2 border-transparent";
                            }
                        }

                        return (
                            <button
                                key={option.id}
                                disabled={selectedOptionId !== null}
                                onClick={() => handleOptionClick(option.id)}
                                className={`w-full p-5 text-left rounded-2xl transition-all duration-200 flex items-center justify-between group active:scale-[0.98] ${buttonStyle}`}
                            >
                                <span className="text-lg font-bold leading-snug">{option.japanese}</span>
                                {icon}
                            </button>
                        );
                    })}
                </div>
            </>
        ) : (
            <>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border-2 border-gray-100 dark:border-gray-700 mb-4 text-center">
                    <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-wider">英語に訳してください</p>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 leading-relaxed">
                        {currentCard.japanese}
                    </h3>
                </div>

                <div className={`min-h-[120px] bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 mb-4 p-4 flex flex-wrap content-start gap-2 ${scrambleResult === 'correct' ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : scrambleResult === 'incorrect' ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
                    {scrambleSelected.map((item, idx) => (
                        <button
                            key={`${item.id}-selected`}
                            onClick={() => handleScrambleDeselect(item, idx)}
                            className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-lg font-bold shadow-sm animate-in zoom-in duration-200 border border-blue-200 dark:border-blue-800 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
                        >
                            {item.text}
                        </button>
                    ))}
                    {scrambleSelected.length === 0 && !scrambleResult && (
                        <span className="text-gray-400 dark:text-gray-500 italic w-full text-center mt-8">下の単語をタップして文章を完成させてください</span>
                    )}
                     {scrambleResult === 'correct' && (
                         <div className="w-full flex justify-center mt-2 text-green-600 font-bold items-center gap-2"><CheckCircle size={20}/> 正解！</div>
                     )}
                     {scrambleResult === 'incorrect' && (
                         <div className="w-full text-center mt-2">
                            <div className="flex justify-center text-red-600 font-bold items-center gap-2 mb-1"><XCircle size={20}/> 不正解...</div>
                            <div className="text-sm text-gray-500">{currentCard.english}</div>
                         </div>
                     )}
                </div>

                <div className="flex-1 overflow-y-auto content-start">
                     <div className="flex flex-wrap gap-2 justify-center pb-4">
                        {scrambleShuffled.map((item) => (
                             <button
                                key={item.id}
                                disabled={item.used || scrambleResult !== null}
                                onClick={() => handleScrambleSelect(item)}
                                className={`px-3 py-2 rounded-xl font-semibold border-b-4 transition-all active:scale-95 active:border-b-0 active:translate-y-1 ${
                                    item.used 
                                    ? 'opacity-0 pointer-events-none' 
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                {item.text}
                            </button>
                        ))}
                     </div>
                </div>

                <Button 
                    onClick={checkScrambleAnswer} 
                    disabled={scrambleSelected.length === 0 || scrambleResult !== null}
                    className="w-full h-14 text-lg font-bold shadow-lg"
                >
                    答え合わせ
                </Button>
            </>
        )}
    </div>
  );
};

// 5. Manage Mode
const ManageMode: React.FC<{
  cards: Flashcard[];
  setCards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
}> = ({ cards, setCards }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ english: '', japanese: '', category: 'General' });

  const filteredCards = cards.filter(card => 
    card.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.japanese.includes(searchTerm) ||
    card.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('このカードを削除しますか？')) {
      setCards(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleEdit = (card: Flashcard) => {
    setEditingCard(card);
    setFormData({ english: card.english, japanese: card.japanese, category: card.category });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingCard(null);
    setFormData({ english: '', japanese: '', category: 'General' });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.english || !formData.japanese) return;

    if (editingCard) {
        setCards(prev => prev.map(c => c.id === editingCard.id ? { ...c, ...formData } : c));
    } else {
        const newCard: Flashcard = {
            id: uuidv4(),
            english: formData.english,
            japanese: formData.japanese,
            category: formData.category,
            isFavorite: false
        };
        setCards(prev => [newCard, ...prev]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 sticky top-16 z-40 bg-gray-50 dark:bg-gray-900 py-4">
        <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="単語を検索..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-base"
            />
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-auto h-12 shadow-md shadow-blue-500/20 font-bold">
            <Plus size={20} className="mr-2" /> カード追加
        </Button>
      </div>

      <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50 flex items-center justify-between">
          <div>
              <h3 className="text-sm font-bold text-red-800 dark:text-red-200">カードの不具合？</h3>
              <p className="text-xs text-red-600 dark:text-red-300">データが壊れている場合は初期状態に戻してください。</p>
          </div>
          <Button 
            onClick={() => {
                if(confirm("すべてのカードを初期データに戻しますか？この操作は取り消せません。")) {
                    setCards(INITIAL_DATA);
                }
            }} 
            variant="danger" 
            size="sm"
            className="flex items-center gap-2"
          >
             <RefreshCw size={16} /> データをリセット
          </Button>
      </div>

      <div className="grid gap-4 pb-20">
        {filteredCards.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>カードが見つかりません。</p>
            </div>
        ) : (
            filteredCards.map(card => (
                <div key={card.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:shadow-lg transition-all duration-200">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 uppercase tracking-wide">{card.category}</span>
                            {card.isFavorite && <Star size={14} className="fill-yellow-400 text-yellow-400"/>}
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 leading-snug">{card.english}</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-base font-medium">{card.japanese}</p>
                    </div>
                    <div className="flex items-center gap-2 border-t pt-3 sm:border-0 sm:pt-0 border-gray-100 dark:border-gray-700">
                        <button 
                            onClick={() => handleEdit(card)}
                            className="flex-1 sm:flex-none py-2 sm:py-2.5 px-4 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex justify-center"
                        >
                            <Edit2 size={20} />
                        </button>
                        <button 
                            onClick={() => handleDelete(card.id)}
                            className="flex-1 sm:flex-none py-2 sm:py-2.5 px-4 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex justify-center"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>

      {isFormOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center sm:p-4 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-5 duration-200">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                      {editingCard ? 'カード編集' : '新規カード'}
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">英語</label>
                          <textarea 
                              required
                              rows={3}
                              value={formData.english}
                              onChange={(e) => setFormData({...formData, english: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-medium text-lg resize-none"
                              placeholder="例: Apple"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">日本語</label>
                          <textarea 
                              required
                              rows={2}
                              value={formData.japanese}
                              onChange={(e) => setFormData({...formData, japanese: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-medium text-lg resize-none"
                              placeholder="例: リンゴ"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">カテゴリ</label>
                          <input 
                              type="text"
                              required
                              value={formData.category}
                              onChange={(e) => setFormData({...formData, category: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-medium"
                          />
                      </div>
                      <div className="flex gap-4 mt-8">
                          <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="flex-1 h-12 font-bold text-gray-500">キャンセル</Button>
                          <Button type="submit" className="flex-1 h-12 font-bold shadow-lg shadow-blue-500/20">保存</Button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  // Enhanced initialization to prevent empty text issues
  const [cards, setCards] = useState<Flashcard[]>(() => {
    if (typeof window === 'undefined') return INITIAL_DATA;
    try {
      const saved = localStorage.getItem('flashcards-data');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Strict validation: Ensure the FIRST card has content. If it's an empty string, reload defaults.
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].english && parsed[0].english.trim() !== "") {
          return parsed;
        }
        console.warn("Saved data invalid or empty, reverting to defaults");
      }
    } catch (e) {
      console.error("Failed to load cards", e);
    }
    return INITIAL_DATA;
  });
  
  const [mode, setMode] = useState<AppMode>('study');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
       return localStorage.getItem('theme') === 'dark' || 
       (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    localStorage.setItem('flashcards-data', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const toggleFavorite = (id: string) => {
    setCards(prev => prev.map(c => 
      c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar mode={mode} setMode={setMode} isDark={isDark} toggleTheme={toggleTheme} />
      
      <main className="container mx-auto">
        {mode === 'study' && (
          <StudyMode 
            cards={cards} 
            toggleFavorite={toggleFavorite}
            showFavoritesOnly={showFavoritesOnly}
            setShowFavoritesOnly={setShowFavoritesOnly}
          />
        )}
        {mode === 'list' && (
          <ListMode 
            cards={cards} 
            toggleFavorite={toggleFavorite}
          />
        )}
        {mode === 'quiz' && (
          <QuizMode 
            cards={cards} 
            toggleFavorite={toggleFavorite}
            showFavoritesOnly={showFavoritesOnly}
            setShowFavoritesOnly={setShowFavoritesOnly}
          />
        )}
        {mode === 'manage' && (
          <ManageMode cards={cards} setCards={setCards} />
        )}
      </main>
    </div>
  );
};

export default App;