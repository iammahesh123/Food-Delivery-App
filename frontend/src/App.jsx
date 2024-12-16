import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import Order from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Restaurants from './pages/Restaurants/Restaurants'
import FeatureServices from './pages/FeatureServices/FeatureServices'
import CollectionsPage from './pages/CollectionsPage/CollectionsPage'
import ContactUs from './components/ContactUS/ContactUs'
import MenuPage from './pages/MenuPage/MenuPage'

const App = () => {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<Order />} />
          <Route path='/restaurants' element={<Restaurants />} />
          <Route path="/feature/:featureName" element={<FeatureServices />} />
          <Route path="/collections/:collectionName" element={<CollectionsPage />} />
          <Route path='/contact-us' element={<ContactUs />} />
          <Route path='/explore-menu' element={<MenuPage/>}/>
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
