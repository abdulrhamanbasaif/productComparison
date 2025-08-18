import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, ProductContextType } from '../types';

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 16"',
    description: 'Powerful laptop for professionals with M2 Pro chip',
    price: 2499,
    category: 'Laptops',
    brand: 'Apple',
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
    inStock: true,
    stockQuantity: 15,
    features: ['M2 Pro chip', '16GB RAM', '512GB SSD', 'Retina Display'],
    specifications: {
      'Processor': 'Apple M2 Pro',
      'RAM': '16GB',
      'Storage': '512GB SSD',
      'Display': '16.2" Retina',
      'Weight': '4.7 lbs'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with titanium design and advanced camera system',
    price: 999,
    category: 'Smartphones',
    brand: 'Apple',
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    inStock: true,
    stockQuantity: 25,
    features: ['A17 Pro chip', '128GB Storage', 'Pro Camera System', 'Titanium Design'],
    specifications: {
      'Processor': 'A17 Pro',
      'Storage': '128GB',
      'Camera': '48MP Main',
      'Display': '6.1" Super Retina XDR',
      'Weight': '6.60 oz'
    },
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z'
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5',
    description: 'Premium noise canceling wireless headphones',
    price: 399,
    category: 'Audio',
    brand: 'Sony',
    image: 'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg',
    inStock: false,
    stockQuantity: 0,
    features: ['Noise Canceling', '30h Battery', 'Multipoint Connection', 'Quick Charge'],
    specifications: {
      'Battery Life': '30 hours',
      'Driver': '30mm',
      'Weight': '8.8 oz',
      'Connectivity': 'Bluetooth 5.2',
      'Charging': 'USB-C'
    },
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z'
  }
];

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id 
          ? { ...product, ...productData, updatedAt: new Date().toISOString() }
          : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  const value: ProductContextType = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};