// RestaurantPage.js
import React, { useState } from 'react';
import Overview from './RestaurantOveriew';
import './RestaurantPage.css';
import OnlineOrder from './OnlineOrder';
import ReviewComponent from './ReviewComponent';
import BookTable from './BookTable';

const RestaurantPage = ({ restaurant }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showImages, setShowImages] = useState(true); // State to control image visibility

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowImages(false); // Hide images when a tab is clicked
  };

  return (
    <div className="restaurant-page">
      {/* Header Section */}
      <div className="restaurant-header">
        <div className="header-left">
          <h1>{restaurant.name}</h1>
          <p className="restaurant-type">{restaurant.type}</p>
          <p className="restaurant-address">{restaurant.address}</p>
          <p className="restaurant-opening">Opening Hours: {restaurant.openingTimes}</p>
        </div>
        <div className="header-right">
          <div className="rating">
            <span className="rating-value">{restaurant.rating}</span>
            <span className="rating-text">Rating</span>
          </div>
          <div className="delivery-rating">
            <span className="delivery-rating-value">{restaurant.deliveryRating}</span>
            <span className="delivery-rating-text">Delivery Rating</span>
          </div>
        </div>
      </div>

      {/* Restaurant Images (Conditional Rendering) */}
      {showImages && (
        <div className="restaurant-images">
          {restaurant.images.map((image, index) => (
            <img key={index} src={image} alt={`Restaurant ${index + 1}`} />
          ))}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        {['Overview', 'Order Online', 'Reviews', 'Photos', 'Book Table'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab.toLowerCase().replace(/ /g, '') ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.toLowerCase().replace(/ /g, ''))}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && <Overview restaurant={restaurant} />}
        {activeTab === 'orderonline' && <OnlineOrder restaurant={restaurant} />}
        {activeTab === 'reviews' && <ReviewComponent reviews={restaurant.reviews} />}
        {activeTab === 'photos' && (
          <div className="photos-grid">
            {restaurant.photos.map((photo, index) => (
              <div key={index} className="photo-card">
                <img src={photo} alt={`Restaurant ${index + 1}`} />
              </div>
            ))}
          </div>
        )}
        {activeTab === 'menu' && (
          <ul className="menu-list">
            {restaurant.menu.map((item, index) => (
              <li key={index}>
                <span className="menu-item">{item.name}</span>
                <span className="menu-price">${item.price}</span>
              </li>
            ))}
          </ul>
        )}
        {activeTab === 'booktable' && <BookTable />}
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>FAQ</h2>
        {restaurant.faq.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantPage;