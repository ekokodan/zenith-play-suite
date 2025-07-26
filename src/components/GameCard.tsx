import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  onPlay: () => void;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  players?: string;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  icon: Icon,
  gradient,
  onPlay,
  difficulty = 'Medium',
  players = '1 Player'
}) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-success bg-success/10';
      case 'Medium': return 'text-warning bg-warning/10';
      case 'Hard': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="group relative bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-primary/50">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity duration-300`} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6" />
          </div>
          
          <div className="text-right">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-muted-foreground bg-surface px-2 py-1 rounded">
            {players}
          </span>
        </div>

        {/* Play Button */}
        <Button
          onClick={onPlay}
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium transition-all duration-300 group-hover:shadow-lg"
        >
          Play Now
        </Button>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

export default GameCard;