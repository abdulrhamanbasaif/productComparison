import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Package, DollarSign, Percent } from 'lucide-react';
import { Product } from '../../types';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../hooks/useAuth';

interface BulkDiscountFormProps {
  onBack: () => void;
}

interface ProductWithDiscount extends Product {
  selected: boolean;
  newPrice?: number;
  newSalePrice?: number;
  sallaId?: string;
  sku?: string;
  regularPrice?: number;
  salePrice?: number;
  status?: 'active' | 'draft' | 'hidden';
}

const BulkDiscountForm: React.FC<BulkDiscountFormProps> = ({ onBack }) => {
  const { products } = useProducts();
  const { token } = useAuth();
  
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [productList, setProductList] = useState<ProductWithDiscount[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Initialize product list with extended properties
  useEffect(() => {
    const extendedProducts: ProductWithDiscount[] = products.map(product => ({
      ...product,
      selected: false,
      sallaId: `SALLA_${product.id}`, // Mock Salla ID
      sku: `SKU_${product.id.slice(0, 8)}`, // Mock SKU
      regularPrice: product.price,
      salePrice: product.price,
      status: product.inStock ? 'active' : 'draft'
    }));
    setProductList(extendedProducts);
  }, [products]);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setProductList(prev => prev.map(product => ({
      ...product,
      selected: newSelectAll
    })));
  };

  const handleSelectProduct = (productId: string) => {
    setProductList(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, selected: !product.selected }
        : product
    ));
  };

  const applyDiscount = () => {
    if (discountValue <= 0) {
      setMessage('Please enter a valid discount value');
      return;
    }

    setIsApplying(true);
    setMessage('');

    setProductList(prev => prev.map(product => {
      if (!product.selected) return product;

      let newPrice = product.price;
      let newSalePrice = product.price;

      if (discountType === 'percentage') {
        const discountAmount = (product.price * discountValue) / 100;
        newSalePrice = Math.max(0, product.price - discountAmount);
      } else {
        newSalePrice = Math.max(0, product.price - discountValue);
      }

      return {
        ...product,
        newPrice,
        newSalePrice,
        salePrice: newSalePrice
      };
    }));

    setIsApplying(false);
    setMessage(`Discount applied to ${productList.filter(p => p.selected).length} products`);
  };

  const saveChanges = async () => {
    const selectedProducts = productList.filter(p => p.selected && p.newSalePrice !== undefined);
    
    if (selectedProducts.length === 0) {
      setMessage('No products selected for update');
      return;
    }

    setIsSaving(true);
    setMessage('');

    try {
      const payload = selectedProducts.map(product => ({
        id: product.id,
        salla_id: product.sallaId,
        price: product.newPrice || product.price,
        regular_price: product.regularPrice || product.price,
        sale_price: product.newSalePrice || product.salePrice
      }));

      const response = await fetch('http://127.0.0.1:8000/api/products/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ products: payload }),
      });

      if (response.ok) {
        setMessage('Changes saved successfully!');
        // Reset selections
        setProductList(prev => prev.map(product => ({
          ...product,
          selected: false,
          newPrice: undefined,
          newSalePrice: undefined
        })));
        setSelectAll(false);
        setDiscountValue(0);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || 'Failed to save changes'}`);
      }
    } catch (error) {
      console.error('Error saving bulk discount:', error);
      setMessage('Error: Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCount = productList.filter(p => p.selected).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Bulk Discount Manager</h1>
      </div>

      {/* Sticky Discount Controls */}
      <div className="sticky top-16 z-40 bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Value
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step={discountType === 'percentage' ? '1' : '0.01'}
                  max={discountType === 'percentage' ? '100' : undefined}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter discount value"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {discountType === 'percentage' ? (
                    <Percent size={16} className="text-gray-400" />
                  ) : (
                    <DollarSign size={16} className="text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Package size={16} className="mr-2" />
              {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={applyDiscount}
              disabled={selectedCount === 0 || discountValue <= 0 || isApplying}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isApplying ? 'Applying...' : 'Apply Discount'}
            </button>
            
            <button
              onClick={saveChanges}
              disabled={selectedCount === 0 || isSaving}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Check size={16} className="mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-md ${
            message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salla ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Regular Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sale Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productList.map((product) => (
                <tr 
                  key={product.id} 
                  className={`hover:bg-gray-50 ${product.selected ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={product.selected}
                      onChange={() => handleSelectProduct(product.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sallaId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover mr-3"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          img.onerror = null;
                          img.src = 'https://via.placeholder.com/40x40?text=No+Image';
                        }}
                      />
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {product.description.length > 50 
                            ? `${product.description.substring(0, 50)}...` 
                            : product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${product.newPrice !== undefined ? product.newPrice.toFixed(2) : product.price.toFixed(2)}
                      {product.newPrice !== undefined && product.newPrice !== product.price && (
                        <div className="text-xs text-gray-500 line-through">
                          ${product.price.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(product.regularPrice || product.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${product.newSalePrice !== undefined ? product.newSalePrice.toFixed(2) : (product.salePrice || product.price).toFixed(2)}
                      {product.newSalePrice !== undefined && product.newSalePrice !== (product.salePrice || product.price) && (
                        <div className="text-xs text-green-600">
                          Updated
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      product.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : product.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {productList.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-600">Add some products to manage bulk discounts</p>
          </div>
        )}
      </div>

      {/* Summary */}
      {selectedCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Check size={20} className="text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">
                {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected for bulk discount
              </span>
            </div>
            {discountValue > 0 && (
              <div className="text-blue-800 font-medium">
                {discountType === 'percentage' ? `${discountValue}% off` : `$${discountValue} off`}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkDiscountForm;