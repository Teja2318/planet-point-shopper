import { useState } from 'react';
import { Product } from '@/types/product';
import { calculateEcoScore, getAIInsight } from '@/utils/ecoScoreCalculator';
import { EcoScoreBadge } from './EcoScoreBadge';
import { DangerWarning } from './DangerWarning';
import { FeedbackForm } from './FeedbackForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShoppingCart, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
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
  const [showWarning, setShowWarning] = useState(false);
  const { addToCart, updateStats, submitFeedback, getFeedbackForProduct } = useApp();
  const ecoScore = calculateEcoScore(product.name, product.description, product.carbonFootprint, product.recyclabilityRating);
  const aiInsight = getAIInsight(ecoScore);
  const brandScore = brandScores[product.brand] || 50;
  const productAlternatives = alternatives[product.id] || [];
  const userFeedback = getFeedbackForProduct(product.id);
  const isDangerous = ecoScore.score < 50;

  const handleViewDetails = () => {
    if (isDangerous && !showWarning) {
      setShowWarning(true);
    } else {
      setShowDetails(true);
      setShowWarning(false);
      // Update stats when viewing product
      const points = ecoScore.score > 70 ? 10 : 0;
      const co2 = ecoScore.score > 70 ? 0.5 : 0;
      updateStats(points, co2, ecoScore.score > 70);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart! 🛒`, {
      description: ecoScore.score > 70 ? '🌿 Great eco-friendly choice!' : undefined
    });
  };

  const handleFeedbackSubmit = (vote: 'up' | 'down', comment: string, images: string[]) => {
    submitFeedback({
      productId: product.id,
      vote,
      comment,
      images,
      timestamp: Date.now()
    });
    toast.success('Thank you for your detailed feedback! 🌿');
  };

  const handleProceedAnyway = () => {
    setShowWarning(false);
    setShowDetails(true);
    // Update stats when viewing product
    const points = ecoScore.score > 70 ? 10 : 0;
    const co2 = ecoScore.score > 70 ? 0.5 : 0;
    updateStats(points, co2, ecoScore.score > 70);
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
          {isDangerous && (
            <div className="absolute top-3 left-3 z-10">
              <DangerWarning size="md" />
            </div>
          )}
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

      {/* Warning Dialog */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <DangerWarning size="lg" />
              <DialogTitle className="text-xl">Environmental Warning</DialogTitle>
            </div>
          </DialogHeader>
          
          <Alert variant="destructive" className="border-danger">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>⚠️ Environmental Danger Alert</AlertTitle>
            <AlertDescription className="space-y-2 mt-2">
              <p className="font-semibold">This product has a low EcoScore of {ecoScore.score}.</p>
              {ecoScore.dangerReasons && ecoScore.dangerReasons.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Why is this harmful to the environment?</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {ecoScore.dangerReasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>

          <div className="space-y-3 mt-4">
            <p className="text-sm text-muted-foreground">
              {ecoScore.explanation}
            </p>
            
            {productAlternatives.length > 0 && (
              <div className="p-3 bg-success/10 border border-success rounded-lg">
                <p className="text-sm font-semibold text-success mb-2">
                  🌿 Consider these eco-friendly alternatives:
                </p>
                <div className="space-y-2">
                  {productAlternatives.slice(0, 2).map(alt => (
                    <div key={alt.id} className="text-xs text-muted-foreground">
                      • {alt.name} (EcoScore: {alt.ecoScore})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowWarning(false)}
              className="flex-1"
            >
              Go Back
            </Button>
            <Button
              onClick={handleProceedAnyway}
              variant="default"
              className="flex-1"
            >
              View Anyway
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Details Dialog */}
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
            
            {isDangerous && (
              <Alert variant="destructive" className="border-danger">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>⚠️ Environmental Danger</AlertTitle>
                <AlertDescription className="space-y-2 mt-2">
                  {ecoScore.dangerReasons && ecoScore.dangerReasons.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {ecoScore.dangerReasons.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className={`p-4 rounded-lg space-y-3 ${isDangerous ? 'bg-danger/10 border border-danger' : 'bg-muted'}`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold">EcoScore</span>
                <div className="flex items-center gap-2">
                  {isDangerous && <DangerWarning size="sm" />}
                  <span className={`text-2xl font-bold ${isDangerous ? 'text-danger' : 'text-primary'}`}>
                    {ecoScore.score}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {ecoScore.explanation}
              </p>
              <p className="text-sm italic text-muted-foreground">
                {aiInsight}
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">♻️</span>
                    <span className="text-xs font-medium">Recyclability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          ecoScore.recyclabilityRating >= 70 ? 'bg-success' : 
                          ecoScore.recyclabilityRating >= 40 ? 'bg-warning' : 'bg-danger'
                        }`}
                        style={{ width: `${ecoScore.recyclabilityRating}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{ecoScore.recyclabilityRating}%</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💨</span>
                    <span className="text-xs font-medium">CO₂ Footprint</span>
                  </div>
                  <div className="text-sm">
                    <span className={`font-bold ${
                      ecoScore.carbonFootprint < 2 ? 'text-success' : 
                      ecoScore.carbonFootprint < 5 ? 'text-warning' : 'text-danger'
                    }`}>
                      {ecoScore.carbonFootprint} kg
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">CO₂</span>
                  </div>
                </div>
              </div>
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
              <div className="p-4 bg-success/10 border border-success rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-success">
                  <span>🌿</span>
                  Recommended Eco-Friendly Alternatives
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  These products serve the same purpose but with less environmental impact
                </p>
                <div className="space-y-3">
                  {productAlternatives.map(alt => (
                    <div key={alt.id} className="flex items-center gap-3 p-3 bg-background rounded-lg border hover:border-success transition-colors">
                      <img src={alt.image} alt={alt.name} className="w-16 h-16 rounded object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alt.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-success font-semibold">
                            EcoScore: {alt.ecoScore}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs font-semibold text-foreground">${alt.price}</span>
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {userFeedback ? (
              <div className="p-4 bg-success/10 border border-success rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-success font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Thank you for your feedback!</span>
                </div>
                
                {userFeedback.comment && (
                  <div>
                    <p className="text-sm font-medium mb-1">Your comment:</p>
                    <p className="text-sm text-muted-foreground">{userFeedback.comment}</p>
                  </div>
                )}
                
                {userFeedback.images.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Your proof images:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {userFeedback.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Proof ${idx + 1}`}
                          className="w-full aspect-square object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <FeedbackForm
                productId={product.id}
                onSubmit={handleFeedbackSubmit}
              />
            )}

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
