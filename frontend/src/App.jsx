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
import RestaurantPage from './pages/RestrauntPages/RestaurantPage';

const restaurant = {
  name: "Delicious Bites",
  rating: 4.5,
  deliveryRating: 4.2,
  type: "Italian, Pizza, Pasta",
  address: "123 Main Street, New York, NY",
  openingTimes: "10:00 AM - 10:00 PM",
  images: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1661953124283-76d0a8436b87?q=80&w=2088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],
  overview: "A cozy place with a variety of cuisines to satisfy your taste buds.",
  offers: ["10% off on all orders above $50", "Free dessert on Fridays"],
  menus: ["Lunch Menu", "Dinner Menu", "Dessert Menu"],
  menuItems: {
    "Lunch Menu": [
      {
        name: "Margherita Pizza",
        image: "https://images.unsplash.com/photo-1564936281291-294551497d81?q=80&w=1952&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Classic pizza with fresh mozzarella, tomatoes, and basil.",
        rating: 4.5,
        price: 10,
      },
      {
        name: "Caesar Salad",
        image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Crisp romaine lettuce with croutons, parmesan, and Caesar dressing.",
        rating: 4.2,
        price: 8,
      },
      {
        name: "Pasta Carbonara",
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Creamy pasta with pancetta, eggs, and parmesan.",
        rating: 4.7,
        price: 12,
      },
    ],
    "Dinner Menu": [
      {
        name: "Grilled Salmon",
        image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Freshly grilled salmon with a side of vegetables.",
        rating: 4.6,
        price: 18,
      },
      {
        name: "Steak Frites",
        image: "https://images.unsplash.com/photo-1504973960431-1c467e159aa4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Juicy steak served with crispy fries.",
        rating: 4.8,
        price: 22,
      },
      {
        name: "Vegetable Lasagna",
        image: "https://images.unsplash.com/photo-1666599207792-d25938831199?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Layered pasta with fresh vegetables and cheese.",
        rating: 4.4,
        price: 14,
      },
    ],
    "Dessert Menu": [
      {
        name: "Tiramisu",
        image: "https://plus.unsplash.com/premium_photo-1695028377770-6cc9d957e1e4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Classic Italian dessert with coffee and mascarpone.",
        rating: 4.9,
        price: 7,
      },
      {
        name: "Chocolate Lava Cake",
        image: "https://plus.unsplash.com/premium_photo-1716152282009-3ee413548e46?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Warm chocolate cake with a gooey center.",
        rating: 4.7,
        price: 8,
      },
      {
        name: "Cheesecake",
        image: "https://images.unsplash.com/photo-1567171466295-4afa63d45416?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Creamy cheesecake with a graham cracker crust.",
        rating: 4.5,
        price: 6,
      },
    ],
  },
  averageCost: "$30 for two",
  famousFoods: ["Pizza Margherita", "Spaghetti Carbonara", "Tiramisu"],
  reviews: [
    {
      author: "John Doe",
      rating: 4.5,
      text: "Great food and excellent service! The pizza was amazing.",
      date: "2023-10-01",
    },
    {
      author: "Jane Smith",
      rating: 5,
      text: "The best pizza in town! Highly recommend the Margherita Pizza.",
      date: "2023-10-05",
    },
    {
      author: "Alice Johnson",
      rating: 4,
      text: "Loved the pasta carbonara. The service was a bit slow, but the food made up for it.",
      date: "2023-10-10",
    },
  ],
  photos: [
    "https://plus.unsplash.com/premium_photo-1661953124283-76d0a8436b87?q=80&w=2088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1661953124283-76d0a8436b87?q=80&w=2088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],
  faq: [
    { question: "Do you offer vegan options?", answer: "Yes, we have a variety of vegan dishes." },
    { question: "Is parking available?", answer: "Yes, we have a dedicated parking area." },
  ],
};

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
          {/* <Route path='/restaurants' element={<Restaurants />} /> */}
          <Route path="/featureservices" element={<FeatureServices />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path='/contact-us' element={<ContactUs />} />
          <Route path='/explore-menu' element={<MenuPage />} />
          <Route path='/restaurants' element={<RestaurantPage restaurant={restaurant} />} />

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