import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, ChevronLeft, ChevronRight, Volume2, RotateCcw } from 'lucide-react';

interface PhraseCard {
  id: string;
  french: string;
  english: string;
  pronunciation: string;
  category: string;
}

const SpeakingCard: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressInterval = useRef<NodeJS.Timeout>();

  // Sample phrase cards
  const phrases: PhraseCard[] = [
    {
      id: '1',
      french: 'Bonjour',
      english: 'Hello',
      pronunciation: 'bon-ZHOOR',
      category: 'Greetings'
    },
    {
      id: '2',
      french: 'Comment allez-vous?',
      english: 'How are you?',
      pronunciation: 'koh-mahn tah-lay VOO',
      category: 'Questions'
    },
    {
      id: '3',
      french: 'Je ne comprends pas',
      english: 'I don\'t understand',
      pronunciation: 'zhuh nuh kom-prahn PAH',
      category: 'Common Phrases'
    },
    {
      id: '4',
      french: 'Excusez-moi',
      english: 'Excuse me',
      pronunciation: 'ex-kew-zay MWAH',
      category: 'Politeness'
    },
    {
      id: '5',
      french: 'Où est la gare?',
      english: 'Where is the train station?',
      pronunciation: 'oo ay lah GAHR',
      category: 'Directions'
    },
    {
      id: '6',
      french: 'Combien ça coûte?',
      english: 'How much does it cost?',
      pronunciation: 'kom-bee-an sah KOOT',
      category: 'Shopping'
    }
  ];

  const currentPhrase = phrases[currentIndex];

  // Simulate audio playback
  const playPronunciation = async () => {
    if (isPlaying) return;

    setIsPlaying(true);
    setProgress(0);

    // Simulate 2-second audio duration
    const duration = 2000;
    const interval = 50;
    let elapsed = 0;

    progressInterval.current = setInterval(() => {
      elapsed += interval;
      const newProgress = (elapsed / duration) * 100;
      setProgress(newProgress);

      if (elapsed >= duration) {
        clearInterval(progressInterval.current);
        setIsPlaying(false);
        setProgress(0);
      }
    }, interval);

    // In a real app, you would use Web Speech API or audio files
    // For demo purposes, we'll just simulate the timing
  };

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : phrases.length - 1);
    setShowTranslation(false);
  };

  const goToNext = () => {
    setCurrentIndex(prev => prev < phrases.length - 1 ? prev + 1 : 0);
    setShowTranslation(false);
  };

  const toggleTranslation = () => {
    setShowTranslation(prev => !prev);
  };

  const resetToFirst = () => {
    setCurrentIndex(0);
    setShowTranslation(false);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          playPronunciation();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 't':
        case 'T':
          e.preventDefault();
          toggleTranslation();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Greetings': 'from-pastel-blue to-blue-400',
      'Questions': 'from-pastel-green to-green-400',
      'Common Phrases': 'from-pastel-yellow to-yellow-400',
      'Politeness': 'from-pastel-pink to-pink-400',
      'Directions': 'from-purple-300 to-purple-500',
      'Shopping': 'from-orange-300 to-orange-500'
    };
    return colors[category as keyof typeof colors] || 'from-gray-300 to-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Speaking Cards
          </h1>
          <p className="text-muted-foreground">Practice French pronunciation with interactive flashcards</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Card {currentIndex + 1} of {phrases.length}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(currentPhrase.category)} text-white font-medium`}>
              {currentPhrase.category}
            </span>
          </div>
          <div className="w-full bg-surface rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / phrases.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="relative bg-card rounded-2xl shadow-xl border border-border overflow-hidden mb-8">
          {/* Card Background Decoration */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(currentPhrase.category)} opacity-5`} />
          
          <div className="relative p-8 md:p-12">
            {/* French Text */}
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-slide-up">
                {currentPhrase.french}
              </h2>
              
              {/* Pronunciation Guide */}
              <div className="text-lg text-muted-foreground font-mono mb-6">
                /{currentPhrase.pronunciation}/
              </div>

              {/* Audio Controls */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <Button
                    onClick={playPronunciation}
                    disabled={isPlaying}
                    className="relative bg-primary hover:bg-primary/90 text-primary-foreground w-16 h-16 rounded-full text-lg shadow-lg"
                  >
                    {isPlaying ? (
                      <Volume2 className="w-6 h-6 animate-pulse" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </Button>
                  
                  {/* Progress Ring */}
                  {isPlaying && (
                    <svg className="absolute inset-0 w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className="text-primary-glow"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                        style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Translation Toggle */}
              <Button
                onClick={toggleTranslation}
                variant="outline"
                className="mb-6"
              >
                {showTranslation ? 'Hide Translation' : 'Show Translation'}
              </Button>

              {/* English Translation */}
              {showTranslation && (
                <div className="p-4 bg-surface rounded-lg animate-slide-up">
                  <p className="text-xl font-medium text-accent">
                    {currentPhrase.english}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <Button
            onClick={goToPrevious}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <Button
              onClick={resetToFirst}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <span className="text-sm text-muted-foreground px-4">
              {currentIndex + 1} / {phrases.length}
            </span>
          </div>

          <Button
            onClick={goToNext}
            variant="outline"
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            <kbd className="px-2 py-1 bg-surface rounded">Space/Enter</kbd> to play • 
            <kbd className="px-2 py-1 bg-surface rounded mx-1">←→</kbd> to navigate • 
            <kbd className="px-2 py-1 bg-surface rounded">T</kbd> for translation
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpeakingCard;