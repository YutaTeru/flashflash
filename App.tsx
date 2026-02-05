import React, { useState, useEffect } from 'react';
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
  RefreshCw
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
            VocabMaster
          </span>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <NavButton 
            active={mode === 'study'} 
            onClick={() => setMode('study')} 
            icon={<BookOpen size={20} />} 
            label="Study" 
          />
          <NavButton 
            active={mode === 'quiz'} 
            onClick={() => setMode('quiz')} 
            icon={<BrainCircuit size={20} />} 
            label="Quiz" 
          />
          <NavButton 
            active={mode === 'manage'} 
            onClick={() => setMode('manage')} 
            icon={<Settings size={20} />} 
            label="Manage" 
          />
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 sm:mx-2" />
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors active:scale-90"
            aria-label="Toggle Theme"
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
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No cards found</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6 text-lg">
          {showFavoritesOnly 
            ? "No favorites yet. Add some stars to your cards!" 
            : "Your deck is empty. Add cards in Manage mode."}
        </p>
        {showFavoritesOnly && (
           <Button variant="outline" onClick={() => setShowFavoritesOnly(false)}>
             Show All Cards
           </Button>
        )}
      </div>
    );
  }

  // Ensure text isn't undefined or empty string, fallback to placeholder
  const getDisplayText = (text: string | undefined) => {
      if (!text || text.trim() === '') return "(No Text)";
      return text;
  };

  const frontText = getDisplayText(isReverse ? currentCard?.japanese : currentCard?.english);
  const backText = getDisplayText(isReverse ? currentCard?.english : currentCard?.japanese);
  const frontLang = isReverse ? "Japanese" : "English";
  const backLang = isReverse ? "English" : "Japanese";

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
            {isReverse ? 'JP → EN' : 'EN → JP'}
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
               <span className="opacity-50 text-[10px] uppercase tracking-wider">Tap to flip</span>
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
          <ArrowLeft size={24} className="mr-2" /> Prev
        </Button>
        <Button 
          variant="primary" 
          size="lg"
          onClick={handleNext} 
          disabled={currentIndex === studyDeck.length - 1}
          className="w-full h-14 text-lg font-bold shadow-lg shadow-blue-500/20"
        >
          Next <ArrowRight size={24} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

// 3. Quiz Mode
const QuizMode: React.FC<{
  cards: Flashcard[];
  toggleFavorite: (id: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (v: boolean) => void;
}> = ({ cards, toggleFavorite, showFavoritesOnly, setShowFavoritesOnly }) => {
  const [gameState, setGameState] = useState<QuizState>('idle');
  const [quizDeck, setQuizDeck] = useState<Flashcard[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState<Flashcard[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const startQuiz = () => {
    let deck = showFavoritesOnly ? cards.filter(c => c.isFavorite) : [...cards];
    if (deck.length < 4) {
      alert("Need at least 4 cards to start a quiz!");
      return;
    }
    deck = deck.sort(() => Math.random() - 0.5);
    setQuizDeck(deck);
    setScore(0);
    setCurrentQuestionIndex(0);
    setGameState('playing');
    generateOptions(deck[0], deck);
  };

  const generateOptions = (correctCard: Flashcard, deck: Flashcard[]) => {
    const distractors = cards
      .filter(c => c.id !== correctCard.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const allOptions = [correctCard, ...distractors].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setSelectedOptionId(null);
  };

  const handleOptionClick = (optionId: string) => {
    if (selectedOptionId) return;
    
    setSelectedOptionId(optionId);
    const correctId = quizDeck[currentQuestionIndex].id;
    
    if (optionId === correctId) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < quizDeck.length - 1) {
        const nextIdx = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIdx);
        generateOptions(quizDeck[nextIdx], quizDeck);
      } else {
        setGameState('result');
      }
    }, 1200);
  };

  const getRank = (percentage: number) => {
    if (percentage === 100) return 'Perfect! 🏆';
    if (percentage >= 80) return 'Excellent! 🌟';
    if (percentage >= 60) return 'Good Job! 👍';
    return 'Keep Practicing! 💪';
  };

  if (gameState === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-6 text-center">
        <div className="p-8 bg-blue-50 dark:bg-blue-900/20 rounded-full animate-bounce-slow ring-8 ring-blue-50/50 dark:ring-blue-900/10">
           <BrainCircuit className="w-16 h-16 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Quiz Time</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Test your skills with 4-choice questions.
          </p>
        </div>
        
        <div className="flex flex-col gap-4 w-full max-w-xs">
            <Button size="lg" onClick={startQuiz} className="w-full h-14 text-lg font-bold shadow-xl shadow-blue-500/20">
              Start Quiz
            </Button>
            <button 
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 py-2 transition-colors"
            >
                {showFavoritesOnly ? <CheckCircle size={16} /> : <div className="w-4 h-4 rounded-full border border-gray-300" />}
                Quiz Favorites Only
            </button>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    const percentage = Math.round((score / quizDeck.length) * 100);
    const data = [
      { name: 'Correct', value: score, color: '#10b981' },
      { name: 'Incorrect', value: quizDeck.length - score, color: '#ef4444' },
    ];

    return (
      <div className="max-w-md mx-auto py-12 px-4 flex flex-col items-center animate-in fade-in zoom-in duration-300">
        <h2 className="text-4xl font-extrabold mb-2 text-gray-900 dark:text-white">{getRank(percentage)}</h2>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 font-medium">Score: {score} / {quizDeck.length}</p>

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
                Menu
             </Button>
             <Button onClick={startQuiz} variant="primary" className="h-12 font-bold">
                Retry <RotateCcw size={18} className="ml-2" />
             </Button>
        </div>
      </div>
    );
  }

  const currentCard = quizDeck[currentQuestionIndex];

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-80px)] sm:h-auto">
        {/* Progress */}
        <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                Q{currentQuestionIndex + 1} / {quizDeck.length}
            </span>
            <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                Score: {score}
            </span>
        </div>
        
        <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-8 overflow-hidden">
            <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestionIndex) / quizDeck.length) * 100}%` }}
            />
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border-2 border-gray-100 dark:border-gray-700 mb-6 text-center min-h-[180px] flex items-center justify-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 leading-relaxed">
                {currentCard.english}
            </h3>
        </div>

        {/* Options */}
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
    </div>
  );
};

// 4. Manage Mode
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
    if (confirm('Delete this card?')) {
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
                placeholder="Search vocabulary..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-base"
            />
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-auto h-12 shadow-md shadow-blue-500/20 font-bold">
            <Plus size={20} className="mr-2" /> Add Card
        </Button>
      </div>

      {/* Backup Reset Button */}
      <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50 flex items-center justify-between">
          <div>
              <h3 className="text-sm font-bold text-red-800 dark:text-red-200">Trouble with cards?</h3>
              <p className="text-xs text-red-600 dark:text-red-300">If text is missing or data is broken, reset to defaults.</p>
          </div>
          <Button 
            onClick={() => {
                if(confirm("Reset all cards to default vocabulary list? This cannot be undone.")) {
                    setCards(INITIAL_DATA);
                }
            }} 
            variant="danger" 
            size="sm"
            className="flex items-center gap-2"
          >
             <RefreshCw size={16} /> Reset Data
          </Button>
      </div>

      <div className="grid gap-4 pb-20">
        {filteredCards.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No cards found.</p>
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
                      {editingCard ? 'Edit Card' : 'New Card'}
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">English</label>
                          <textarea 
                              required
                              rows={3}
                              value={formData.english}
                              onChange={(e) => setFormData({...formData, english: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-medium text-lg resize-none"
                              placeholder="e.g. Apple"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Japanese</label>
                          <textarea 
                              required
                              rows={2}
                              value={formData.japanese}
                              onChange={(e) => setFormData({...formData, japanese: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-medium text-lg resize-none"
                              placeholder="e.g. リンゴ"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                          <input 
                              type="text"
                              required
                              value={formData.category}
                              onChange={(e) => setFormData({...formData, category: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-medium"
                          />
                      </div>
                      <div className="flex gap-4 mt-8">
                          <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="flex-1 h-12 font-bold text-gray-500">Cancel</Button>
                          <Button type="submit" className="flex-1 h-12 font-bold shadow-lg shadow-blue-500/20">Save Card</Button>
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