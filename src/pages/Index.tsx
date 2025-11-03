import { useState } from 'react';
import { products } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { Dashboard } from '@/components/Dashboard';
import { CartDrawer } from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { BarChart3, ShoppingCart, Leaf } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const Index = () => {
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cart } = useApp();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-eco rounded-full flex items-center justify-center text-white">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">EcoShopper</h1>
                <p className="text-xs text-muted-foreground">Shop Green, Live Clean</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setDashboardOpen(true)}
                variant="outline"
                size="icon"
                className="relative"
              >
                <BarChart3 className="w-5 h-5" />
              </Button>
              
              <Button
                onClick={() => setCartOpen(true)}
                variant="outline"
                size="icon"
                className="relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-semibold animate-pulse-glow">
                    {itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold animate-slide-up">
            Shop Smarter, Live Greener 🌿
          </h2>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto animate-fade-in">
            Discover eco-friendly products with instant EcoScores. Every purchase makes a difference!
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-2">Featured Products</h3>
          <p className="text-muted-foreground">Browse our collection and make sustainable choices</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted py-8 mt-12">
        <div className="container mx-auto px-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-lg font-semibold">
            <Leaf className="w-5 h-5 text-primary" />
            <span>EcoShopper</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Making sustainable shopping easy, one product at a time 🌍
          </p>
          <p className="text-xs text-muted-foreground">
            © 2024 EcoShopper. Built with 💚 for the planet.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <Dashboard open={dashboardOpen} onOpenChange={setDashboardOpen} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
};

export default Index;
