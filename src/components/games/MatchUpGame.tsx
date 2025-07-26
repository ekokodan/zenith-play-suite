import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Shuffle, Star } from 'lucide-react';

interface Card {
  id: string;
  content: string;
  type: 'french' | 'english';
  isFlipped: boolean;
  isMatched: boolean;
  pairId: string;
}

const MatchUpGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Card pairs data
  const cardPairs = [
    { french: 'Bonjour', english: 'Hello' },
    { french: 'Au revoir', english: 'Goodbye' },
    { french: 'Merci', english: 'Thank you' },
    { french: 'S\'il vous plaît', english: 'Please' },
    { french: 'Excusez-moi', english: 'Excuse me' },
    { french: 'Comment allez-vous?', english: 'How are you?' },
    { french: 'Je ne comprends pas', english: 'I don\'t understand' },
    { french: 'Parlez-vous anglais?', english: 'Do you speak English?' },
  ];

  // Initialize game
  const initializeGame = useCallback(() => {
    const gameCards: Card[] = [];
    
    cardPairs.forEach((pair, index) => {
      const pairId = `pair-${index}`;
      
      gameCards.push({
        id: `french-${index}`,
        content: pair.french,
        type: 'french',
        isFlipped: false,
        isMatched: false,
        pairId
      });
      
      gameCards.push({
        id: `english-${index}`,
        content: pair.english,
        type: 'english',
        isFlipped: false,
        isMatched: false,
        pairId
      });
    });

    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameComplete(false);
  }, []);

  // Handle card click
  const handleCardClick = (clickedCard: Card) => {
    if (
      clickedCard.isFlipped || 
      clickedCard.isMatched || 
      flippedCards.length >= 2
    ) {
      return;
    }

    const updatedCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    
    setCards(updatedCards);
    setFlippedCards(prev => [...prev, clickedCard]);
  };

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [card1, card2] = flippedCards;
      const isMatch = card1.pairId === card2.pairId;

      setTimeout(() => {
        setCards(prev => prev.map(card => {
          if (card.id === card1.id || card.id === card2.id) {
            if (isMatch) {
              return { ...card, isMatched: true };
            } else {
              return { ...card, isFlipped: false };
            }
          }
          return card;
        }));

        if (isMatch) {
          setMatches(prev => prev + 1);
        }

        setFlippedCards([]);
      }, 1000);
    }
  }, [flippedCards]);

  // Check game completion
  useEffect(() => {
    if (matches === cardPairs.length && gameStarted) {
      setGameComplete(true);
    }
  }, [matches, gameStarted]);

  // Start game
  const startGame = () => {
    setGameStarted(true);
    initializeGame();
  };

  // Shuffle cards
  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  };

  // Reset game
  const resetGame = () => {
    setGameStarted(false);
    initializeGame();
  };

  // Initialize on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const getCardClassName = (card: Card) => {
    let className = "relative w-full h-24 rounded-lg cursor-pointer transition-all duration-300 transform perspective-1000 ";
    
    if (card.isMatched) {
      className += "bg-gradient-to-br from-success to-success/80 text-success-foreground scale-105 shadow-glow ";
    } else if (card.isFlipped) {
      className += card.type === 'french' 
        ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-md "
        : "bg-gradient-to-br from-accent to-accent-glow text-accent-foreground shadow-md ";
    } else {
      className += "bg-gradient-to-br from-surface to-surface-elevated hover:scale-105 shadow-sm ";
    }

    return className;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Memory Match
          </h1>
          <p className="text-muted-foreground">Match French phrases with their English translations</p>
        </div>

        {/* Game Stats */}
        <div className="flex items-center justify-between mb-6 p-4 bg-card rounded-lg shadow-md">
          <div className="flex items-center gap-6">
            <div className="bg-surface px-4 py-2 rounded-md">
              <span className="text-sm text-muted-foreground">Moves:</span>
              <span className="ml-2 font-bold text-lg text-primary">{moves}</span>
            </div>
            <div className="bg-surface px-4 py-2 rounded-md">
              <span className="text-sm text-muted-foreground">Matches:</span>
              <span className="ml-2 font-bold text-lg text-accent">{matches}/{cardPairs.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!gameStarted ? (
              <Button onClick={startGame} className="bg-accent hover:bg-accent/90">
                <Star className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            ) : (
              <>
                <Button onClick={shuffleCards} variant="outline" disabled={flippedCards.length > 0}>
                  <Shuffle className="w-4 h-4" />
                </Button>
                <Button onClick={resetGame} variant="outline">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Game Grid */}
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={getCardClassName(card)}
                style={{ perspective: '1000px' }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-3">
                  {card.isFlipped || card.isMatched ? (
                    <div className="text-center animate-flip-card">
                      <p className="font-semibold text-sm leading-tight">{card.content}</p>
                      <div className="absolute top-1 right-1">
                        <div className={`w-2 h-2 rounded-full ${
                          card.type === 'french' ? 'bg-blue-300' : 'bg-yellow-300'
                        }`} />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted/80 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 bg-primary/20 rounded-full" />
                    </div>
                  )}
                </div>

                {/* Matched glow effect */}
                {card.isMatched && (
                  <div className="absolute inset-0 rounded-lg bg-success/20 animate-pulse-glow" />
                )}
              </div>
            ))}
          </div>

          {/* Victory Overlay */}
          {gameComplete && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center rounded-xl">
              <div className="text-center animate-bounce-in bg-card p-8 rounded-xl shadow-xl">
                <div className="mb-4">
                  <Star className="w-16 h-16 text-accent mx-auto animate-pulse-glow" />
                </div>
                <h3 className="text-3xl font-bold text-accent mb-4">Félicitations!</h3>
                <p className="text-muted-foreground mb-2">You completed the game!</p>
                <p className="text-lg font-semibold text-primary mb-6">
                  Finished in {moves} moves
                </p>
                <Button onClick={resetGame} className="bg-primary hover:bg-primary/90">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Click cards to flip them and find matching pairs. French phrases are marked with 🔵 and English with 🟡</p>
        </div>
      </div>
    </div>
  );
};

export default MatchUpGame;