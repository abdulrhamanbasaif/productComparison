import React from 'react';
import { Package, GitCompare, TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import {useAuth} from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';




interface AdminDashboardProps {
  compareCount: number;
  onNavigateToProducts: () => void;
  onNavigateToCompare: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  compareCount, 
  onNavigateToProducts, 
  onNavigateToCompare 
}) => {
  const { user } = useAuth(); // Get the logged-in user

  // Redirect if the user is not an admin
  if (!user || !user.is_admin) {
    return <Navigate to="/" replace />;
  }

  const { products } = useProducts();

  const stats = {
    totalProducts: products.length,
    comparisons: compareCount
  };

  
  const categories = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const brands = products.reduce((acc, product) => {
    acc[product.brand] = (acc[product.brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
  }> = ({ title, value, icon, color, onClick }) => (
    <div 
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your product management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package className="h-6 w-6 text-white" />}
          color="bg-blue-500"
          onClick={onNavigateToProducts}
        />
        <StatCard
          title="Comparisons Made"
          value={stats.comparisons}
          icon={<GitCompare className="h-6 w-6 text-white" />}
          color="bg-orange-500"
          onClick={onNavigateToCompare}
        />
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Products by Category</h3>
          {Object.keys(categories).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(categories)
                .sort(([,a], [,b]) => b - a)
                .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(count / stats.totalProducts) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No categories available</p>
          )}
        </div>

        {/* Brands Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Products by Brand</h3>
          {Object.keys(brands).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(brands)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([brand, count]) => (
                <div key={brand} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{brand}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(count / stats.totalProducts) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No brands available</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h3>
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  
                  
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No products available</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;