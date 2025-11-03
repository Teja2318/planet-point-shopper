import { useState } from 'react';
import { Product } from '@/types/product';
import { calculateEcoScore, getAIInsight } from '@/utils/ecoScoreCalculator';
import { EcoScoreBadge } from './EcoScoreBadge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart, ThumbsUp, ThumbsDown, Info } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { brandScores, alternatives } from '@/data/products';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { addToCart, updateStats, feedback, submitFeedback } = useApp();
  const ecoScore = calculateEcoScore(product.name, product.description);
  const aiInsight = getAIInsight(ecoScore);
  const brandScore = brandScores[product.brand] || 50;
  const productAlternatives = alternatives[product.id] || [];
  const userFeedback = feedback[product.id];

  const handleViewDetails = () => {
    setShowDetails(true);
    // Update stats when viewing product
    const points = ecoScore.score > 70 ? 10 : 0;
    const co2 = ecoScore.score > 70 ? 0.5 : 0;
    updateStats(points, co2, ecoScore.score > 70);
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart! 🛒`, {
      description: ecoScore.score > 70 ? '🌿 Great eco-friendly choice!' : undefined
    });
  };

  const handleFeedback = (vote: 'up' | 'down') => {
    submitFeedback(product.id, vote);
    toast.success(vote === 'up' ? 'Thanks for your feedback! 👍' : 'Thanks for your feedback! 👎');
  };

  return (
    <>
      <Card className="group relative overflow-hidden hover:shadow-eco transition-all duration-300 animate-fade-in">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <EcoScoreBadge ecoScore={ecoScore} />
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground">
              {product.brand}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAddToCart}
              className="flex-1"
              variant="default"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              onClick={handleViewDetails}
              variant="outline"
              size="icon"
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-video object-cover rounded-lg"
            />
            
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold">EcoScore</span>
                <span className="text-2xl font-bold text-primary">
                  {ecoScore.score}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {ecoScore.explanation}
              </p>
              <p className="text-sm italic text-muted-foreground mt-2">
                {aiInsight}
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Brand: {product.brand}</span>
                <span className="text-sm text-muted-foreground">
                  Sustainability: {brandScore}%
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>

            {productAlternatives.length > 0 && ecoScore.score < 60 && (
              <div className="p-4 bg-warning/10 border border-warning rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span>🌿</span>
                  Eco-Friendly Alternatives
                </h4>
                <div className="space-y-2">
                  {productAlternatives.map(alt => (
                    <div key={alt.id} className="flex items-center gap-3 p-2 bg-background rounded">
                      <img src={alt.image} alt={alt.name} className="w-12 h-12 rounded object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alt.name}</p>
                        <p className="text-xs text-muted-foreground">EcoScore: {alt.ecoScore}</p>
                      </div>
                      <span className="text-sm font-semibold">${alt.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-muted-foreground">Was this score helpful?</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={userFeedback === 'up' ? 'default' : 'outline'}
                  onClick={() => handleFeedback('up')}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Yes
                </Button>
                <Button
                  size="sm"
                  variant={userFeedback === 'down' ? 'default' : 'outline'}
                  onClick={() => handleFeedback('down')}
                >
                  <ThumbsDown className="w-4 h-4 mr-1" />
                  No
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-2xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              <Button onClick={handleAddToCart}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
