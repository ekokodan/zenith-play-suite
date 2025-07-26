import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Lightbulb, Check, X } from 'lucide-react';

interface Letter {
  id: string;
  letter: string;
  position: number;
  isPlaced: boolean;
}

interface AnagramPuzzle {
  word: string;
  scrambled: string;
  hint: string;
  definition: string;
}

const AnagramBuilder: React.FC = () => {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [placedLetters, setPlacedLetters] = useState<(Letter | null)[]>([]);
  const [draggedLetter, setDraggedLetter] = useState<Letter | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showShakeAnimation, setShowShakeAnimation] = useState(false);

  // Puzzle data
  const puzzles: AnagramPuzzle[] = [
    {
      word: 'BONJOUR',
      scrambled: 'RJOOBUN',
      hint: 'A French greeting',
      definition: 'Hello in French'
    },
    {
      word: 'MERCI',
      scrambled: 'CRIME',
      hint: 'Shows gratitude',
      definition: 'Thank you in French'
    },
    {
      word: 'FAMILLE',
      scrambled: 'ELIMLAF',
      hint: 'People related to you',
      definition: 'Family in French'
    },
    {
      word: 'ECOLE',
      scrambled: 'CELOE',
      hint: 'Place of learning',
      definition: 'School in French'
    },
    {
      word: 'CHIEN',
      scrambled: 'NEHCI',
      hint: 'Man\'s best friend',
      definition: 'Dog in French'
    }
  ];

  const currentWord = puzzles[currentPuzzle];

  // Initialize letters for current puzzle
  const initializeLetters = useCallback(() => {
    const newLetters: Letter[] = currentWord.scrambled.split('').map((letter, index) => ({
      id: `letter-${index}`,
      letter: letter.toUpperCase(),
      position: index,
      isPlaced: false
    }));

    setLetters(newLetters);
    setPlacedLetters(new Array(currentWord.word.length).fill(null));
    setIsCorrect(false);
    setShowHint(false);
    setAttempts(0);
  }, [currentWord]);

  // Handle drag start
  const handleDragStart = (letter: Letter) => {
    setDraggedLetter(letter);
  };

  // Handle drop on drop zone
  const handleDrop = (dropIndex: number) => {
    if (!draggedLetter) return;

    // Remove letter from previous position if it was placed
    const newPlacedLetters = [...placedLetters];
    const prevIndex = newPlacedLetters.findIndex(l => l?.id === draggedLetter.id);
    if (prevIndex !== -1) {
      newPlacedLetters[prevIndex] = null;
    }

    // Place letter in new position
    newPlacedLetters[dropIndex] = draggedLetter;
    setPlacedLetters(newPlacedLetters);

    // Update letter state
    setLetters(prev => prev.map(l => 
      l.id === draggedLetter.id ? { ...l, isPlaced: true } : l
    ));

    setDraggedLetter(null);
  };

  // Handle letter removal from drop zone
  const removeLetter = (removeIndex: number) => {
    const letterToRemove = placedLetters[removeIndex];
    if (!letterToRemove) return;

    const newPlacedLetters = [...placedLetters];
    newPlacedLetters[removeIndex] = null;
    setPlacedLetters(newPlacedLetters);

    setLetters(prev => prev.map(l => 
      l.id === letterToRemove.id ? { ...l, isPlaced: false } : l
    ));
  };

  // Check if word is correct
  const checkWord = () => {
    const formedWord = placedLetters.map(l => l?.letter || '').join('');
    const isWordCorrect = formedWord === currentWord.word;
    
    setAttempts(prev => prev + 1);
    
    if (isWordCorrect) {
      setIsCorrect(true);
    } else {
      // Show shake animation for incorrect attempt
      setShowShakeAnimation(true);
      setTimeout(() => setShowShakeAnimation(false), 500);
    }
  };

  // Move to next puzzle
  const nextPuzzle = () => {
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(prev => prev + 1);
    } else {
      setCurrentPuzzle(0); // Loop back to first puzzle
    }
  };

  // Reset current puzzle
  const resetPuzzle = () => {
    initializeLetters();
  };

  // Toggle hint
  const toggleHint = () => {
    setShowHint(prev => !prev);
  };

  // Auto-check when all positions are filled
  useEffect(() => {
    const allFilled = placedLetters.every(letter => letter !== null);
    if (allFilled && !isCorrect) {
      setTimeout(() => checkWord(), 300);
    }
  }, [placedLetters]);

  // Initialize on mount and puzzle change
  useEffect(() => {
    initializeLetters();
  }, [initializeLetters, currentPuzzle]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Anagram Builder
          </h1>
          <p className="text-muted-foreground">Drag and drop letters to form the correct French word</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-6 p-4 bg-card rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-surface px-4 py-2 rounded-md">
              <span className="text-sm text-muted-foreground">Puzzle:</span>
              <span className="ml-2 font-bold text-lg text-primary">
                {currentPuzzle + 1}/{puzzles.length}
              </span>
            </div>
            <div className="bg-surface px-4 py-2 rounded-md">
              <span className="text-sm text-muted-foreground">Attempts:</span>
              <span className="ml-2 font-bold text-lg text-accent">{attempts}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={toggleHint} variant="outline" size="sm">
              <Lightbulb className="w-4 h-4" />
            </Button>
            <Button onClick={resetPuzzle} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Hint */}
        {showHint && (
          <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-lg animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-accent" />
              <span className="font-medium text-accent">Hint:</span>
            </div>
            <p className="text-foreground">{currentWord.hint}</p>
          </div>
        )}

        {/* Drop Zone */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-center mb-4 text-muted-foreground">
            Build the word here:
          </h3>
          <div 
            className={`flex justify-center gap-2 p-6 bg-card rounded-xl border-2 border-dashed transition-all duration-300 ${
              showShakeAnimation ? 'animate-shake border-error' : 'border-border'
            }`}
          >
            {placedLetters.map((letter, index) => (
              <div
                key={index}
                className="relative w-16 h-16 bg-surface border-2 border-border rounded-lg flex items-center justify-center text-xl font-bold transition-all duration-200 hover:border-primary cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                onClick={() => letter && removeLetter(index)}
              >
                {letter ? (
                  <>
                    <span className="text-foreground animate-bounce-in">{letter.letter}</span>
                    <button className="absolute -top-2 -right-2 w-5 h-5 bg-error rounded-full flex items-center justify-center text-error-foreground text-xs opacity-0 hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <div className="w-8 h-8 border-2 border-dashed border-muted rounded" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Letter Bank */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-center mb-4 text-muted-foreground">
            Available letters:
          </h3>
          <div className="flex flex-wrap justify-center gap-3 p-6 bg-card rounded-xl">
            {letters
              .filter(letter => !letter.isPlaced)
              .map((letter) => (
                <div
                  key={letter.id}
                  draggable
                  onDragStart={() => handleDragStart(letter)}
                  className="w-14 h-14 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground rounded-lg flex items-center justify-center text-xl font-bold cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg"
                >
                  {letter.letter}
                </div>
              ))}
          </div>
        </div>

        {/* Success State */}
        {isCorrect && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card p-8 rounded-2xl shadow-2xl border text-center animate-bounce-in max-w-md w-full mx-4">
              <div className="mb-4">
                <Check className="w-16 h-16 text-success mx-auto animate-pulse-glow" />
              </div>
              <h3 className="text-2xl font-bold text-success mb-2">Correct!</h3>
              <p className="text-lg font-semibold text-primary mb-2">{currentWord.word}</p>
              <p className="text-muted-foreground mb-6">{currentWord.definition}</p>
              <p className="text-sm text-muted-foreground mb-6">
                Completed in {attempts} attempt{attempts !== 1 ? 's' : ''}
              </p>
              
              <div className="flex gap-3 justify-center">
                <Button onClick={nextPuzzle} className="bg-accent hover:bg-accent/90">
                  {currentPuzzle < puzzles.length - 1 ? 'Next Puzzle' : 'Start Over'}
                </Button>
                <Button onClick={resetPuzzle} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Drag letters from the bank to the word builder, or click placed letters to remove them</p>
        </div>
      </div>
    </div>
  );
};

export default AnagramBuilder;