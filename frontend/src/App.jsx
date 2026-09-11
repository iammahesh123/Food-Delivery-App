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
import MerchantDiningManager from './components/AdminDashboard/DiningManager/MerchantDiningManager';
import DiningHub from './pages/Dining/DiningHub';
import DiningBookingPage from './pages/Dining/DiningBookingPage';
import MyDiningBookings from './pages/Dining/MyDiningBookings';
import LiveEventsHub from './pages/LiveEvents/LiveEventsHub';
import EventBookingPage from './pages/LiveEvents/EventBookingPage';
import MyEventTickets from './pages/LiveEvents/MyEventTickets';
import MerchantEventsManager from './components/AdminDashboard/EventsManager/MerchantEventsManager';

// Platform Super Admin Console
import AdminLayout from './components/PlatformAdmin/AdminLayout/AdminLayout';
import AdminOverview from './components/PlatformAdmin/Screens/AdminOverview';
import AdminRestaurants from './components/PlatformAdmin/Screens/AdminRestaurants';
import AdminUsers from './components/PlatformAdmin/Screens/AdminUsers';
import AdminOrders from './components/PlatformAdmin/Screens/AdminOrders';
import AdminDining from './components/PlatformAdmin/Screens/AdminDining';
import AdminEvents from './components/PlatformAdmin/Screens/AdminEvents';
import AdminPromos from './components/PlatformAdmin/Screens/AdminPromos';
import AdminSettings from './components/PlatformAdmin/Screens/AdminSettings';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  // Check if current route is a backoffice route (Merchant or Platform Admin)
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isBackofficeRoute = isDashboardRoute || isAdminRoute;

  return (
    <>
      {/* Login / Registration Modal */}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      {/* Customer Header - hidden on backoffice / admin routes */}
      {!isBackofficeRoute && <Navbar setShowLogin={setShowLogin} />}

      <div className={isBackofficeRoute ? 'dashboard-app-wrapper' : location.pathname === '/' ? 'app-fullwidth' : 'app'}>
        <Routes>
          {/* Customer Marketplace Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/explore-menu" element={<MenuPage />} />
          <Route path="/dining" element={<DiningHub />} />
          <Route path="/dining/book/:restaurantId" element={<DiningBookingPage />} />
          <Route path="/my-dining" element={<MyDiningBookings />} />
          <Route path="/events" element={<LiveEventsHub />} />
          <Route path="/events/:eventId" element={<EventBookingPage />} />
          <Route path="/my-tickets" element={<MyEventTickets />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/orders/:orderId" element={<OrderStatus />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/featureservices" element={<FeatureServices />} />
          <Route path="/contact-us" element={<ContactUs />} />

          {/* Platform Super Admin Console Routes */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminOverview />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/restaurants"
            element={
              <AdminLayout>
                <AdminRestaurants />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/dining"
            element={
              <AdminLayout>
                <AdminDining />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/events"
            element={
              <AdminLayout>
                <AdminEvents />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/promos"
            element={
              <AdminLayout>
                <AdminPromos />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            }
          />

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
          <Route
            path="/dashboard/dining"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <MerchantDiningManager />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/events"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <MerchantEventsManager />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>

      {/* Customer Footer - hidden on backoffice / admin routes */}
      {!isBackofficeRoute && <Footer />}
    </>
  );
};

export default App;