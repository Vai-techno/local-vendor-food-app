import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { CartProvider } from './CartContext';

// Pages (to be created)
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerHome from './pages/customer/Home';
import VendorDetails from './pages/customer/VendorDetails';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import VendorDashboard from './pages/vendor/Dashboard';
import VendorOrders from './pages/vendor/Orders';
import AdminDashboard from './pages/admin/Dashboard';

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== allowedRole) {
    return <Navigate to={user.role === 'vendor' ? '/vendor' : '/'} replace />;
  }
  
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Customer Routes */}
            <Route path="/home" element={<CustomerHome />} />
            <Route path="/vendor/:id" element={<VendorDetails />} />
            <Route path="/cart" element={<ProtectedRoute allowedRole="customer"><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute allowedRole="customer"><Checkout /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute allowedRole="customer"><Orders /></ProtectedRoute>} />
            
            {/* Vendor Routes */}
            <Route path="/vendor" element={<ProtectedRoute allowedRole="vendor"><VendorDashboard /></ProtectedRoute>} />
            <Route path="/vendor/orders" element={<ProtectedRoute allowedRole="vendor"><VendorOrders /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
