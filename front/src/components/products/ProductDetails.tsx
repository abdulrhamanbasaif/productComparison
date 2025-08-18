import React from 'react';
import { ArrowLeft, Package, Star, Shield, Truck, Award } from 'lucide-react';
import { Product } from '../../types';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onEdit: (product: Product) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack, onEdit }) => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Products
        </button>
        <button
          onClick={() => onEdit(product)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Edit Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Package className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Stock</p>
                <p className="font-semibold text-gray-900">{product.stockQuantity}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <Star className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-semibold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <span className="text-3xl font-bold text-blue-600">${product.price}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.brand}</p>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            {product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  Key Features
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200">
              <div className="text-center">
                <Shield className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Secure</p>
              </div>
              <div className="text-center">
                <Truck className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Fast Shipping</p>
              </div>
              <div className="text-center">
                <Award className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Quality</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {Object.keys(product.specifications).length > 0 && (
          <div className="border-t border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-gray-600 mb-1">{key}</dt>
                  <dd className="text-lg font-semibold text-gray-900">{value}</dd>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Meta */}
        <div className="border-t border-gray-200 p-8 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <p><strong>Product ID:</strong> {product.id}</p>
              <p><strong>Created:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p><strong>Last Updated:</strong> {new Date(product.updatedAt).toLocaleDateString()}</p>
              <p><strong>Category:</strong> {product.category}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;