import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import GameCard from '@/components/GameCard';
import MazeGame from '@/components/games/MazeGame';
import SpinWheel from '@/components/games/SpinWheel';
import MatchUpGame from '@/components/games/MatchUpGame';
import SpeakingCard from '@/components/games/SpeakingCard';
import AnagramBuilder from '@/components/games/AnagramBuilder';
import { 
  Gamepad2, 
  RotateCcw, 
  Brain, 
  Volume2, 
  Puzzle,
  Home,
  Star,
  Trophy,
  Users
} from 'lucide-react';

type GameType = 'home' | 'maze' | 'wheel' | 'match' | 'speaking' | 'anagram';

const Index = () => {
  const [currentGame, setCurrentGame] = useState<GameType>('home');

  const games = [
    {
      id: 'maze' as GameType,
      title: 'Neon Maze Runner',
      description: 'Navigate through glowing mazes with futuristic neon aesthetics. Use arrow keys or WASD to reach the goal.',
      icon: Gamepad2,
      gradient: 'from-purple-500 to-pink-500',
      difficulty: 'Medium' as const,
      players: '1 Player'
    },
    {
      id: 'wheel' as GameType,
      title: 'Language Wheel',
      description: 'Spin the glassmorphism wheel to practice French verb conjugations with elegant visual effects.',
      icon: RotateCcw,
      gradient: 'from-blue-500 to-cyan-500',
      difficulty: 'Easy' as const,
      players: '1 Player'
    },
    {
      id: 'match' as GameType,
      title: 'Memory Match',
      description: 'Match French phrases with English translations in this beautiful card-flipping memory game.',
      icon: Brain,
      gradient: 'from-green-500 to-emerald-500',
      difficulty: 'Medium' as const,
      players: '1 Player'
    },
    {
      id: 'speaking' as GameType,
      title: 'Speaking Cards',
      description: 'Interactive flashcards with pronunciation guides and audio playback for French learning.',
      icon: Volume2,
      gradient: 'from-orange-500 to-red-500',
      difficulty: 'Easy' as const,
      players: '1 Player'
    },
    {
      id: 'anagram' as GameType,
      title: 'Anagram Builder',
      description: 'Drag and drop letter tiles to solve French word puzzles with helpful hints and definitions.',
      icon: Puzzle,
      gradient: 'from-indigo-500 to-purple-500',
      difficulty: 'Hard' as const,
      players: '1 Player'
    }
  ];

  const renderCurrentGame = () => {
    switch (currentGame) {
      case 'maze':
        return <MazeGame />;
      case 'wheel':
        return <SpinWheel />;
      case 'match':
        return <MatchUpGame />;
      case 'speaking':
        return <SpeakingCard />;
      case 'anagram':
        return <AnagramBuilder />;
      default:
        return renderHomePage();
    }
  };

  const renderHomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-slide-up">
              <Star className="w-4 h-4" />
              French Learning Games Suite
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-6 animate-slide-up">
              Game Your Way
              <br />
              to Fluency
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up">
              Master French through interactive mini-games designed with elegant animations, 
              accessibility features, and engaging gameplay mechanics.
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-16 animate-slide-up">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{games.length}</div>
              <div className="text-sm text-muted-foreground">Games</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">∞</div>
              <div className="text-sm text-muted-foreground">Learning</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Fun</div>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="container mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Adventure</h2>
          <p className="text-muted-foreground">Each game offers unique challenges and learning opportunities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {games.map((game, index) => (
            <div key={game.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <GameCard
                title={game.title}
                description={game.description}
                icon={game.icon}
                gradient={game.gradient}
                difficulty={game.difficulty}
                players={game.players}
                onPlay={() => setCurrentGame(game.id)}
              />
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Our Games?</h2>
            <p className="text-muted-foreground">Built with modern design principles and accessibility in mind</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Progressive Learning</h3>
              <p className="text-sm text-muted-foreground">Difficulty scales with your progress, keeping you challenged but never overwhelmed.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-glow rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Accessible Design</h3>
              <p className="text-sm text-muted-foreground">WCAG 2.1 AA compliant with keyboard navigation and screen reader support.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Beautiful UI</h3>
              <p className="text-sm text-muted-foreground">Elegant animations and glassmorphism effects create an immersive experience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Show back button when in game
  if (currentGame !== 'home') {
    return (
      <div className="relative">
        <Button
          onClick={() => setCurrentGame('home')}
          variant="outline"
          className="fixed top-4 left-4 z-50 bg-card/80 backdrop-blur-sm hover:bg-card"
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
        {renderCurrentGame()}
      </div>
    );
  }

  return renderCurrentGame();
};

export default Index;
