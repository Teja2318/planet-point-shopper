import { EcoScore } from '@/types/product';
import { cn } from '@/lib/utils';

interface EcoScoreBadgeProps {
  ecoScore: EcoScore;
  className?: string;
}

export function EcoScoreBadge({ ecoScore, className }: EcoScoreBadgeProps) {
  const getColorClasses = () => {
    switch (ecoScore.level) {
      case 'high':
        return 'bg-success text-white';
      case 'moderate':
        return 'bg-warning text-foreground';
      case 'low':
        return 'bg-danger text-white';
    }
  };

  const getIcon = () => {
    switch (ecoScore.level) {
      case 'high':
        return '🌿';
      case 'moderate':
        return '💛';
      case 'low':
        return '🔴';
    }
  };

  return (
    <div className={cn(
      "absolute top-3 right-3 px-3 py-2 rounded-lg shadow-eco font-semibold text-sm backdrop-blur-sm animate-fade-in z-10",
      getColorClasses(),
      className
    )}>
      <div className="flex items-center gap-1">
        <span>{getIcon()}</span>
        <span>{ecoScore.score}</span>
      </div>
    </div>
  );
}
