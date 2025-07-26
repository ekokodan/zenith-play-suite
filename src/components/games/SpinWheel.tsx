import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Volume2 } from 'lucide-react';

interface WheelSegment {
  id: string;
  text: string;
  color: string;
}

const SpinWheel: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Sample segments - can be customized
  const segments: WheelSegment[] = [
    { id: '1', text: "je vais", color: "from-pastel-blue to-blue-400" },
    { id: '2', text: "elle va", color: "from-pastel-pink to-pink-400" },
    { id: '3', text: "nous allons", color: "from-pastel-green to-green-400" },
    { id: '4', text: "ils vont", color: "from-pastel-yellow to-yellow-400" },
    { id: '5', text: "tu vas", color: "from-purple-300 to-purple-500" },
    { id: '6', text: "vous allez", color: "from-indigo-300 to-indigo-500" },
    { id: '7', text: "il va", color: "from-teal-300 to-teal-500" },
    { id: '8', text: "je vais danser", color: "from-orange-300 to-orange-500" },
  ];

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);
    setShowConfetti(false);

    // Calculate random rotation (multiple full spins + random position)
    const spins = 5 + Math.random() * 5; // 5-10 full spins
    const finalAngle = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + finalAngle;

    setRotation(totalRotation);

    // Calculate which segment won
    const segmentAngle = 360 / segments.length;
    const adjustedAngle = (360 - (finalAngle % 360)) % 360;
    const winningIndex = Math.floor(adjustedAngle / segmentAngle);
    const winner = segments[winningIndex];

    // Show result after spin animation
    setTimeout(() => {
      setResult(winner.text);
      setIsSpinning(false);
      setShowConfetti(true);
      
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 3000);
    }, 3000);
  };

  const resetWheel = () => {
    setRotation(0);
    setResult(null);
    setShowConfetti(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Language Wheel
          </h1>
          <p className="text-muted-foreground">Spin the wheel to practice French verb forms!</p>
        </div>

        {/* Wheel Container */}
        <div className="relative flex flex-col items-center">
          {/* Pointer */}
          <div className="absolute top-0 z-20 transform -translate-x-1/2 left-1/2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary drop-shadow-lg" />
          </div>

          {/* Wheel */}
          <div className="relative">
            <div
              ref={wheelRef}
              className={`relative w-80 h-80 rounded-full shadow-2xl transition-transform duration-[3000ms] ease-out backdrop-blur-md ${
                isSpinning ? '' : 'hover:scale-105'
              }`}
              style={{
                transform: `rotate(${rotation}deg)`,
                background: 'conic-gradient(from 0deg, var(--glass-bg))',
                border: '2px solid hsl(var(--border))'
              }}
            >
              {/* Glass overlay */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent backdrop-blur-sm" />
              
              {/* Segments */}
              {segments.map((segment, index) => {
                const angle = (360 / segments.length) * index;
                const nextAngle = (360 / segments.length) * (index + 1);
                
                return (
                  <div
                    key={segment.id}
                    className="absolute inset-0 rounded-full overflow-hidden"
                    style={{
                      background: `conic-gradient(from ${angle}deg to ${nextAngle}deg, 
                        hsl(var(--${segment.color.split('-')[1]}-300)), 
                        hsl(var(--${segment.color.split('-')[1]}-500)))`
                    }}
                  >
                    <div
                      className="absolute flex items-center justify-center text-white font-semibold text-sm transform origin-center"
                      style={{
                        transform: `rotate(${angle + (360 / segments.length) / 2}deg) translateY(-120px)`,
                        width: '100%',
                        height: '100%'
                      }}
                    >
                      <span className="transform -rotate-90 whitespace-nowrap px-2 py-1 bg-black/30 rounded backdrop-blur-sm">
                        {segment.text}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full border-4 border-primary-foreground shadow-lg flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Spin Button */}
          <div className="mt-8 flex gap-4">
            <Button
              onClick={spinWheel}
              disabled={isSpinning}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-3 text-lg"
            >
              {isSpinning ? 'Spinning...' : 'Spin It!'}
            </Button>
            
            <Button
              onClick={resetWheel}
              variant="outline"
              className="px-4 py-3"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>

          {/* Result Display */}
          {result && (
            <div className="mt-8 p-6 bg-card rounded-xl shadow-lg border animate-bounce-in">
              <h3 className="text-xl font-bold text-center text-primary mb-2">Result:</h3>
              <p className="text-2xl font-bold text-center text-accent">{result}</p>
            </div>
          )}

          {/* Confetti Effect */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-accent rounded animate-bounce-in"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center text-muted-foreground">
          <p className="text-sm">Click the wheel to spin and discover your French phrase!</p>
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;