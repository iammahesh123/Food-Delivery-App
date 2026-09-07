import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import Order from './pages/PlaceOrder/PlaceOrder';
import OrderStatus from './pages/OrderStatus/OrderStatus';
import MyOrders from './pages/MyOrders/MyOrders';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Restaurants from './pages/Restaurants/Restaurants';
import RestaurantPage from './pages/RestrauntPages/RestaurantPage';
import FeatureServices from './pages/FeatureServices/FeatureServices';
import CollectionsPage from './pages/CollectionsPage/CollectionsPage';
import ContactUs from './components/ContactUS/ContactUs';
import MenuPage from './pages/MenuPage/MenuPage';
import PrivateRoute from './routes/PrivateRoute';
import DashboardLayout from './components/AdminDashboard/DashboardLayout/DashboardLayout';
import Dashboard from './components/AdminDashboard/Dashboard';
import LiveOrders from './components/AdminDashboard/LiveOrders/LiveOrders';
import MenuManager from './components/AdminDashboard/MenuManager/MenuManager';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  // Check if current route is a dashboard route
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <>
      {/* Login / Registration Modal */}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      {/* Customer Header - hidden on dashboard routes */}
      {!isDashboardRoute && <Navbar setShowLogin={setShowLogin} />}

      <div className={isDashboardRoute ? 'dashboard-app-wrapper' : location.pathname === '/' ? 'app-fullwidth' : 'app'}>
        <Routes>
          {/* Customer Marketplace Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/explore-menu" element={<MenuPage />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/orders/:orderId" element={<OrderStatus />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/featureservices" element={<FeatureServices />} />
          <Route path="/contact-us" element={<ContactUs />} />

          {/* Merchant & Operations Console Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/live-orders"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <LiveOrders />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/menu"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <MenuManager />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>

      {/* Customer Footer - hidden on dashboard routes */}
      {!isDashboardRoute && <Footer />}
    </>
  );
};

export default App;