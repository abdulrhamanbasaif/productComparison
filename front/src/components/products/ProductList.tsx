import React, { useState } from 'react';
import { Eye, Edit, Trash2, Plus, GitCompare, Grid3X3, List } from 'lucide-react';
import { Product } from '../../types';
import { useProducts } from '../../hooks/useProducts';

interface ProductListProps {
  products: Product[]; // Added products prop
  onViewProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onAddToCompare: (product: Product) => void;
  compareList: Product[];
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products, // Use the passed products prop
  onViewProduct,
  onEditProduct,
  onAddToCompare,
  compareList,
  viewMode,
  onViewModeChange
}) => {
  const handleDelete = (name: string) => { // Removed unused id parameter
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      // deleteProduct(name);
    }
  };

  const isInCompareList = (productId: string) => {
    return compareList.some(p => p.id === productId);
  };

  const canAddToCompare = (productId: string) => {
    return compareList.length < 2 || isInCompareList(productId);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Plus size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Start by adding your first product</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${product.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${product.inStock
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onViewProduct(product)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onAddToCompare(product)}
                        disabled={!canAddToCompare(product.id)}
                        className={`p-1 rounded ${isInCompareList(product.id)
                          ? 'text-purple-600 bg-purple-100'
                          : canAddToCompare(product.id)
                            ? 'text-purple-600 hover:text-purple-900'
                            : 'text-gray-400 cursor-not-allowed'
                          }`}
                        title={isInCompareList(product.id) ? 'Remove from Compare' : 'Add to Compare'}
                      >
                        <GitCompare size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.name)} // Removed unused id parameter
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="relative bg-gray-50">
            <img
              src={product.image}

              loading="lazy"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                img.onerror = null;
                img.src = 'https://via.placeholder.com/800x600?text=No+Image';
              }}
              className="w-full h-48 object-contain p-2"
            />
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            {isInCompareList(product.id) && (
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-purple-600 text-white rounded-full text-xs font-medium">
                  In Compare
                </span>
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
              <span className="text-xl font-bold text-blue-600">${product.price}</span>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-3">{product.description}</p>

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{product.brand}</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {product.category}
              </span>
            </div>



            <div className="flex space-x-2">
              <button
                onClick={() => onViewProduct(product)}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Eye size={16} className="mr-1" />
                View
              </button>
              <button
                onClick={() => onEditProduct(product)}
                className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                <Edit size={16} className="mr-1" />
                Edit
              </button>
            </div>

            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => onAddToCompare(product)}
                disabled={!canAddToCompare(product.id)}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${isInCompareList(product.id)
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : canAddToCompare(product.id)
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <GitCompare size={16} className="mr-1" />
                {isInCompareList(product.id) ? 'Remove' : 'Compare'}
              </button>
              <button
                onClick={() => handleDelete(product.name)} // Removed unused id parameter
                className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;