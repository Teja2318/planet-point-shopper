import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Moon, Sun, Award, Leaf, TrendingUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DashboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Dashboard({ open, onOpenChange }: DashboardProps) {
  const { stats, theme, toggleTheme, ecoPreference, setEcoPreference } = useApp();

  const ecoPercentage = stats.productsViewed > 0
    ? Math.round((stats.ecoProductsViewed / stats.productsViewed) * 100)
    : 0;

  const getBadgeProgress = () => {
    if (stats.ecoProductsViewed >= 25) return { current: 25, next: '∞', progress: 100 };
    if (stats.ecoProductsViewed >= 10) return { current: stats.ecoProductsViewed, next: 25, progress: ((stats.ecoProductsViewed - 10) / 15) * 100 };
    return { current: stats.ecoProductsViewed, next: 10, progress: (stats.ecoProductsViewed / 10) * 100 };
  };

  const badgeProgress = getBadgeProgress();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>EcoShopper Dashboard</DialogTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Badge Section */}
          <div className="p-4 bg-gradient-eco rounded-lg text-white text-center space-y-2">
            <div className="text-4xl animate-bounce-subtle">{stats.badge.split(' ')[0]}</div>
            <div className="font-semibold text-lg">{stats.badge.split(' ').slice(1).join(' ')}</div>
            <div className="text-sm opacity-90">
              {badgeProgress.current} / {badgeProgress.next} eco products viewed
            </div>
            <div className="w-full bg-white/30 rounded-full h-2 mt-2">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${badgeProgress.progress}%` }}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg text-center space-y-1">
              <Award className="w-8 h-8 mx-auto text-primary" />
              <div className="text-2xl font-bold text-primary">{stats.greenPoints}</div>
              <div className="text-xs text-muted-foreground">Green Points</div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg text-center space-y-1">
              <Leaf className="w-8 h-8 mx-auto text-primary" />
              <div className="text-2xl font-bold text-primary">{stats.co2Saved.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">kg CO₂ Saved</div>
            </div>
          </div>

          {/* Eco Ratio Chart */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Your Eco Impact
              </span>
              <span className="text-sm text-muted-foreground">
                {stats.productsViewed} products viewed
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="w-full bg-muted rounded-full h-8 overflow-hidden">
                <div className="flex h-full">
                  <div
                    className="bg-gradient-eco flex items-center justify-center text-white text-xs font-semibold transition-all duration-500"
                    style={{ width: `${ecoPercentage}%` }}
                  >
                    {ecoPercentage > 15 && `${ecoPercentage}%`}
                  </div>
                  <div
                    className="bg-muted-foreground/20 flex items-center justify-center text-foreground text-xs font-semibold transition-all duration-500"
                    style={{ width: `${100 - ecoPercentage}%` }}
                  >
                    {100 - ecoPercentage > 15 && `${100 - ecoPercentage}%`}
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>🌿 Eco: {stats.ecoProductsViewed}</span>
                <span>Non-eco: {stats.productsViewed - stats.ecoProductsViewed}</span>
              </div>
            </div>
          </div>

          {/* Preference Slider */}
          <div className="space-y-3">
            <div className="text-sm font-semibold">What matters more to you?</div>
            <div className="space-y-2">
              <Slider
                value={[ecoPreference]}
                onValueChange={(value) => setEcoPreference(value[0])}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>💰 Price</span>
                <span>🌱 Eco Score</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="text-sm font-semibold mb-3">Achievements</div>
            <div className="space-y-2">
              <div className={`flex items-center gap-2 ${stats.ecoProductsViewed >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                <span className="text-xl">🌱</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">Eco Beginner</div>
                  <div className="text-xs text-muted-foreground">View 3 eco products</div>
                </div>
                {stats.ecoProductsViewed >= 3 && <span className="text-xs text-success">✓</span>}
              </div>
              
              <div className={`flex items-center gap-2 ${stats.ecoProductsViewed >= 10 ? 'opacity-100' : 'opacity-40'}`}>
                <span className="text-xl">🌿</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">Green Hero</div>
                  <div className="text-xs text-muted-foreground">View 10 eco products</div>
                </div>
                {stats.ecoProductsViewed >= 10 && <span className="text-xs text-success">✓</span>}
              </div>
              
              <div className={`flex items-center gap-2 ${stats.ecoProductsViewed >= 25 ? 'opacity-100' : 'opacity-40'}`}>
                <span className="text-xl">🌎</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">Planet Saver</div>
                  <div className="text-xs text-muted-foreground">View 25 eco products</div>
                </div>
                {stats.ecoProductsViewed >= 25 && <span className="text-xs text-success">✓</span>}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
