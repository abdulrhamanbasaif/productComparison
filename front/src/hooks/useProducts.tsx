import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, ProductContextType } from '../types';
import { useAuth } from './useAuth'; // your AuthContext

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const { user, token } = useAuth(); // 👈 make sure your useAuth provides the token
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch user products on mount
  useEffect(() => {
    if (!user || !token) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8000/api/products', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`, // 👈 include Sanctum token
          },
        });

        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user, token]);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch('http://localhost:8000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, // 👈
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) throw new Error('Failed to create product');
      const newProduct: Product = await res.json();
      setProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const res = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, // 👈
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) throw new Error('Failed to update product');
      const updated: Product = await res.json();
      setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // 👈
        },
      });

      if (!res.ok) throw new Error('Failed to delete product');
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const getProduct = (id: string) => products.find(p => p.id === id);

  const value: ProductContextType = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    loading,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
