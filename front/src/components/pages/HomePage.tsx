import React from 'react';
import { Package, GitCompare, TrendingUp, Users, ArrowRight, Star, Shield, Zap } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';

interface HomePageProps {
  onNavigateToProducts: () => void;
  onNavigateToCompare: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToProducts, onNavigateToCompare }) => {
  const { products } = useProducts();

  const featuredProducts = products.slice(0, 3);

  const FeatureCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
  }> = ({ icon, title, description, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">ProductHub</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your comprehensive product management solution. Organize, compare, and discover products with ease.
            Built for modern businesses that value efficiency and insight.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onNavigateToProducts}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Explore Products
              <ArrowRight size={20} className="ml-2" />
            </button>
            <button
              onClick={onNavigateToCompare}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center"
            >
              <GitCompare size={20} className="mr-2" />
              Compare Products
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{products.length}</h3>
          <p className="text-gray-600">Total Products</p>
        </div>
        <div className="text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {products.filter(p => p.inStock).length}
          </h3>
          <p className="text-gray-600">In Stock</p>
        </div>
        <div className="text-center">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <GitCompare className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">∞</h3>
          <p className="text-gray-600">Comparisons Available</p>
        </div>
      </div>

      {/* Features Section */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ProductHub?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to streamline your product management workflow
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-white" />}
            title="Lightning Fast"
            description="Quick search and filtering capabilities to find exactly what you need in seconds."
            color="bg-yellow-500"
          />
          <FeatureCard
            icon={<GitCompare className="h-6 w-6 text-white" />}
            title="Smart Comparison"
            description="Side-by-side product comparisons with detailed specifications and features."
            color="bg-purple-500"
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6 text-white" />}
            title="Secure & Reliable"
            description="Your product data is safe with our secure and reliable platform."
            color="bg-green-500"
          />
        </div>
      </div>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Discover our top products</p>
            </div>
            <button
              onClick={onNavigateToProducts}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View All
              <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                    <span className="text-lg font-bold text-blue-600">${product.price}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{product.brand}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">Featured</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of businesses already using ProductHub to manage their products efficiently.
        </p>
        <button
          onClick={onNavigateToProducts}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Start Managing Products
        </button>
      </div>
    </div>
  );
};

export default HomePage;