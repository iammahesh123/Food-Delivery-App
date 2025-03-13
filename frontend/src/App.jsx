import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import Order from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Restaurants from './pages/Restaurants/Restaurants';
import FeatureServices from './pages/FeatureServices/FeatureServices';
import CollectionsPage from './pages/CollectionsPage/CollectionsPage';
import ContactUs from './components/ContactUS/ContactUs';
import MenuPage from './pages/MenuPage/MenuPage';
import PrivateRoute from './routes/PrivateRoute';
import Dashboard from './components/AdminDashboard/Dashboard';
import DashboardLayout from './components/AdminDashboard/DashboardLayout/DashboardLayout';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation(); // Get the current route location

  // Check if the current route is a dashboard route
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <>
      {/* Render LoginPopup only for non-dashboard routes */}
      {showLogin && !isDashboardRoute && <LoginPopup setShowLogin={setShowLogin} />}

      {/* Render Navbar and Footer only for non-dashboard routes */}
      {!isDashboardRoute && <Navbar setShowLogin={setShowLogin} />}

      <div className='app'>
        <Routes>
          {/* Non-dashboard routes */}
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<Order />} />
          <Route path='/restaurants' element={<Restaurants />} />
          <Route path="/featureservices" element={<FeatureServices />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path='/contact-us' element={<ContactUs />} />
          <Route path='/explore-menu' element={<MenuPage />} />

          {/* Dashboard routes */}
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    {/* Add other dashboard routes here */}
                    {/* <Route path="/posts" element={<BlogList />} />
                    <Route path="/new-project" element={<AddNewProject />} />
                    <Route path="/services" element={<ServiceDashboard />} />
                    <Route path="/messages" element={<ViewMessages />} />
                    <Route path="/new-post" element={<AddNewPost />} />
                    <Route path="/analytics" element={<DashboardAnalytics />} />
                    <Route path="/settings" element={<Settings />} /> */}
                  </Routes>
                </DashboardLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>

      {/* Render Footer only for non-dashboard routes */}
      {!isDashboardRoute && <Footer />}
    </>
  );
};

export default App;