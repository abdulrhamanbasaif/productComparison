import React from 'react';
import { ArrowLeft, Check, X, Package, Star } from 'lucide-react';
import { Product } from '../../types';

// Normalize specification keys for fair comparison
function normalizeSpecs(specs: Record<string, any>) {
  const normalized: Record<string, any> = {};
  for (const key in specs || {}) {
    const normKey = key.trim().toLowerCase();
    normalized[normKey] = specs[key];
  }
  return normalized;
}

interface ProductComparisonProps {
  products: Product[];
  onClose: () => void;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({ products, onClose }) => {
  const [product1, product2] = products;

  const ComparisonRow: React.FC<{ 
    label: string; 
    value1: string | number | boolean; 
    value2: string | number | boolean;
    type?: 'price' | 'boolean' | 'text' | 'number';
  }> = ({ label, value1, value2, type = 'text' }) => {
    const renderValue = (value: string | number | boolean) => {
      if (type === 'price' && typeof value === 'number') {
        return `$${value.toLocaleString()}`;
      }
      if (type === 'boolean') {
        return value ? <Check className="text-green-600" size={20} /> : <X className="text-red-600" size={20} />;
      }
      if (type === 'number' && typeof value === 'number') {
        return value.toLocaleString();
      }
      return value?.toString() || 'N/A';
    };

    const getComparisonClass = (val1: string | number | boolean, val2: string | number | boolean) => {
      if (type === 'price' && typeof val1 === 'number' && typeof val2 === 'number') {
        if (val1 < val2) return 'bg-green-50 border-green-200';
        if (val1 > val2) return 'bg-red-50 border-red-200';
      }
      if (type === 'number' && typeof val1 === 'number' && typeof val2 === 'number') {
        if (val1 > val2) return 'bg-green-50 border-green-200';
        if (val1 < val2) return 'bg-red-50 border-red-200';
      }
      return '';
    };

    return (
      <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-200 last:border-b-0">
        <div className="font-medium text-gray-700 flex items-center">
          {label}
        </div>
        <div className={`p-3 rounded-md border ${getComparisonClass(value1, value2)} flex items-center justify-center`}>
          {renderValue(value1)}
        </div>
        <div className={`p-3 rounded-md border ${getComparisonClass(value2, value1)} flex items-center justify-center`}>
          {renderValue(value2)}
        </div>
      </div>
    );
  };

  
  const specs1 = normalizeSpecs(product1.specifications || {});
  const specs2 = normalizeSpecs(product2.specifications || {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>
        <h2 className="text-xl font-semibold text-gray-900">Product Comparison</h2>
      </div>

      {/* Product Headers */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div></div>
        {[product1, product2].map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4">
            
            <div className="text-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded-md mb-3"
              />
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-2xl font-bold text-blue-600">${product.price}</p>
              <div className="flex items-center justify-center mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Comparison</h3>
        
        <div className="space-y-0">
          <ComparisonRow label="Name" value1={product1.name} value2={product2.name} />
          <ComparisonRow label="Price" value1={product1.price} value2={product2.price} type="price" />
          <ComparisonRow label="Brand" value1={product1.brand} value2={product2.brand} />
          <ComparisonRow label="Category" value1={product1.category} value2={product2.category} />
          <ComparisonRow label="In Stock" value1={product1.inStock} value2={product2.inStock} type="boolean" />
          <ComparisonRow label="Stock Quantity" value1={product1.stockQuantity} value2={product2.stockQuantity} type="number" />
        </div>
      </div>

      {/* Features Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[product1, product2].map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star size={20} className="mr-2 text-yellow-500" />
              Features - {product.name}
            </h4>
            <div className="space-y-2">
              {product.features.length > 0 ? (
                product.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <Check size={16} className="text-green-600 mr-2" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No features listed</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Specifications Comparison */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Package size={20} className="mr-2 text-blue-500" />
          Specifications
        </h4>
        
        <div className="space-y-0">
          {/* Get all unique normalized specification keys */}
          {Array.from(new Set([
            ...Object.keys(specs1),
            ...Object.keys(specs2)
          ])).map(specKey => (
            <ComparisonRow
              key={specKey}
              label={specKey}
              value1={specs1[specKey] ?? 'N/A'}
              value2={specs2[specKey] ?? 'N/A'}
            />
          ))}
        </div>
      </div>

      {/* Description Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[product1, product2].map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Description - {product.name}
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductComparison;