import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ProductProvider } from './hooks/useProducts';
import { Product } from './types';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './components/pages/HomePage';
import ProductList from './components/products/ProductList';
import ProductForm from './components/products/ProductForm';
import ProductDetails from './components/products/ProductDetails';
import ProductComparison from './components/comparison/ProductComparison';
import SearchAndFilter from './components/search/SearchAndFilter';
import AdminDashboard from './components/admin/AdminDashboard';
import Modal from './components/common/Modal';
import { useProducts } from './hooks/useProducts';
import AmazonImport from './components/amzonproducts';
// Import icon components
import { Package, Grid3X3, List, GitCompare } from 'lucide-react';

const MainApp: React.FC = () => {
  const { products, addProduct, updateProduct } = useProducts();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  const brands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean);

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    addProduct(productData);
    setShowAddForm(false);
  };

  const handleEditProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
    }
  };

  const handleAddToCompare = (product: Product) => {
    setCompareList(prev => {
      const isAlreadyInList = prev.find(p => p.id === product.id);
      if (isAlreadyInList) {
        return prev.filter(p => p.id !== product.id);
      } else if (prev.length < 2) {
        return [...prev, product];
      } else {
        return [prev[1], product];
      }
    });
  };


  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange([0, 10000]);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigateToProducts={() => setCurrentPage('products')}
            onNavigateToCompare={() => setCurrentPage('compare')}
          />
        );

      case 'products':
        if (selectedProduct) {
          return (
            <ProductDetails
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
              onEdit={setEditingProduct}
            />
          );
        }

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                <p className="text-gray-600">Manage your product catalog</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Package className="mr-2" size={20} />
                  Add Product
                </button>
                <div className="sm-white shadow rounded-lg p-4">
                  <AmazonImport />
                </div>

              </div>
            </div>

            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
              categories={categories}
              brands={brands}
              onClearFilters={handleClearFilters}
            />

            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            <ProductList
              onViewProduct={setSelectedProduct}
              onEditProduct={setEditingProduct}
              onAddToCompare={handleAddToCompare}
              compareList={compareList}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        );

      case 'compare':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Comparison</h1>
              <p className="text-gray-600">Compare products side by side</p>
            </div>

            {compareList.length === 0 ? (
              <div className="text-center py-12">
                <GitCompare size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products selected for comparison</h3>
                <p className="text-gray-600 mb-4">Select up to 2 products from the products page to compare them</p>
                <button
                  onClick={() => setCurrentPage('products')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Products
                </button>
              </div>
            ) : compareList.length === 1 ? (
              <div className="text-center py-12">
                <GitCompare size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select one more product to compare</h3>
                <p className="text-gray-600 mb-4">You have selected: {compareList[0].name}</p>
                <button
                  onClick={() => setCurrentPage('products')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Select Another Product
                </button>
              </div>
            ) : (
              <ProductComparison
                products={compareList}
                onClose={() => setCompareList([])}
              />
            )}
          </div>
        );

      case 'admin':
        return (
          <AdminDashboard
            compareCount={compareList.length}
            onNavigateToProducts={() => setCurrentPage('products')}
            onNavigateToCompare={() => setCurrentPage('compare')}
          />
        );

      default:
        return <HomePage onNavigateToProducts={() => setCurrentPage('products')} onNavigateToCompare={() => setCurrentPage('compare')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderCurrentPage()}
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Add New Product"
        size="lg"
      >
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddForm(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title="Edit Product"
        size="lg"
      >
        {editingProduct && (
          <ProductForm
            product={editingProduct}
            onSubmit={handleEditProduct}
            onCancel={() => setEditingProduct(null)}
          />
        )}
      </Modal>
    </div>
  );
};

const AuthWrapper: React.FC = () => {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  return (
    <ProductProvider>
      <MainApp />
    </ProductProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

export default App;