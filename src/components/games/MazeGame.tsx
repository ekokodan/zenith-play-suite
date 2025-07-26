import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface MazeCell {
  x: number;
  y: number;
  isWall: boolean;
  isPath: boolean;
  isStart: boolean;
  isEnd: boolean;
  isVisited: boolean;
}

interface PlayerPosition {
  x: number;
  y: number;
}

const MazeGame: React.FC = () => {
  const [maze, setMaze] = useState<MazeCell[][]>([]);
  const [player, setPlayer] = useState<PlayerPosition>({ x: 1, y: 1 });
  const [gameState, setGameState] = useState<'playing' | 'paused' | 'won'>('playing');
  const [timer, setTimer] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const MAZE_SIZE = 12;

  // Generate maze using simple algorithm
  const generateMaze = useCallback(() => {
    const newMaze: MazeCell[][] = [];
    
    for (let y = 0; y < MAZE_SIZE; y++) {
      newMaze[y] = [];
      for (let x = 0; x < MAZE_SIZE; x++) {
        newMaze[y][x] = {
          x,
          y,
          isWall: Math.random() > 0.7,
          isPath: false,
          isStart: x === 1 && y === 1,
          isEnd: x === MAZE_SIZE - 2 && y === MAZE_SIZE - 2,
          isVisited: false,
        };
      }
    }

    // Ensure borders are walls
    for (let i = 0; i < MAZE_SIZE; i++) {
      newMaze[0][i].isWall = true;
      newMaze[MAZE_SIZE - 1][i].isWall = true;
      newMaze[i][0].isWall = true;
      newMaze[i][MAZE_SIZE - 1].isWall = true;
    }

    // Ensure start and end are not walls
    newMaze[1][1].isWall = false;
    newMaze[MAZE_SIZE - 2][MAZE_SIZE - 2].isWall = false;

    setMaze(newMaze);
    setPlayer({ x: 1, y: 1 });
  }, []);

  // Handle player movement
  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameState !== 'playing') return;

    const newX = player.x + dx;
    const newY = player.y + dy;

    if (
      newX >= 0 && newX < MAZE_SIZE &&
      newY >= 0 && newY < MAZE_SIZE &&
      !maze[newY]?.[newX]?.isWall
    ) {
      setPlayer({ x: newX, y: newY });
      
      // Mark as visited for breadcrumb trail
      setMaze(prev => {
        const updated = [...prev];
        updated[newY][newX] = { ...updated[newY][newX], isVisited: true };
        return updated;
      });

      // Check if won
      if (maze[newY]?.[newX]?.isEnd) {
        setGameState('won');
      }
    }
  }, [player, maze, gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer(1, 0);
          break;
        case ' ':
          e.preventDefault();
          setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && isGameStarted) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, isGameStarted]);

  // Initialize maze
  useEffect(() => {
    generateMaze();
  }, [generateMaze]);

  const startGame = () => {
    setIsGameStarted(true);
    setGameState('playing');
    setTimer(0);
    generateMaze();
  };

  const togglePause = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  const resetGame = () => {
    setIsGameStarted(false);
    setGameState('playing');
    setTimer(0);
    generateMaze();
  };

  const getCellClassName = (cell: MazeCell) => {
    let className = "w-8 h-8 transition-all duration-150 ";
    
    if (cell.isWall) {
      className += "bg-primary border border-primary-glow shadow-neon ";
    } else if (cell.isStart) {
      className += "bg-accent shadow-glow animate-pulse-glow ";
    } else if (cell.isEnd) {
      className += "bg-neon-pink shadow-neon ";
    } else if (cell.isVisited) {
      className += "bg-neon-cyan/30 ";
    } else {
      className += "bg-background border border-border/50 ";
    }

    return className;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background p-6 dark:from-background dark:via-surface dark:to-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Neon Maze Runner
          </h1>
          <p className="text-muted-foreground">Navigate through the glowing maze using arrow keys or WASD</p>
        </div>

        {/* Game Controls */}
        <div className="flex items-center justify-between mb-6 p-4 bg-card rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-surface px-4 py-2 rounded-md">
              <span className="text-sm text-muted-foreground">Time:</span>
              <span className="ml-2 font-mono text-lg text-accent">
                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <div className="bg-surface px-4 py-2 rounded-md">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className="ml-2 font-semibold">
                {gameState === 'won' ? (
                  <span className="text-accent">Victory!</span>
                ) : gameState === 'paused' ? (
                  <span className="text-warning">Paused</span>
                ) : (
                  <span className="text-primary">Playing</span>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isGameStarted ? (
              <Button onClick={startGame} className="bg-accent hover:bg-accent/90">
                <Play className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            ) : (
              <>
                <Button onClick={togglePause} variant="outline">
                  {gameState === 'playing' ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <Button onClick={resetGame} variant="outline">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Maze Grid */}
        <div className="relative bg-background border border-border rounded-xl p-8 shadow-lg dark:bg-surface dark:border-border">
          <div 
            className="grid gap-1 mx-auto"
            style={{ 
              gridTemplateColumns: `repeat(${MAZE_SIZE}, 1fr)`,
              maxWidth: `${MAZE_SIZE * 32}px` 
            }}
          >
            {maze.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`${getCellClassName(cell)} relative`}
                >
                  {/* Player */}
                  {player.x === x && player.y === y && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-neon-yellow rounded-full shadow-neon animate-pulse-glow" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          {/* Pause Overlay */}
          {gameState === 'paused' && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-4">Game Paused</h3>
                <Button onClick={togglePause} className="bg-accent hover:bg-accent/90">
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              </div>
            </div>
          )}

          {/* Victory Overlay */}
          {gameState === 'won' && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center rounded-xl">
              <div className="text-center animate-bounce-in">
                <h3 className="text-3xl font-bold text-accent mb-4">Congratulations!</h3>
                <p className="text-muted-foreground mb-6">
                  You completed the maze in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                </p>
                <Button onClick={resetGame} className="bg-primary hover:bg-primary/90">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Controls Guide */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Use <kbd className="px-2 py-1 bg-surface rounded">↑↓←→</kbd> or <kbd className="px-2 py-1 bg-surface rounded">WASD</kbd> to move • <kbd className="px-2 py-1 bg-surface rounded">Space</kbd> to pause</p>
        </div>
      </div>
    </div>
  );
};

export default MazeGame;