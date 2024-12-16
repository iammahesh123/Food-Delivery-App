import React from 'react';
import './Collection.css';
import { assets, restraunts_list } from '../../assets/assets';

const Collections = () => {
  return (
    <>
      <div className="collections">
        <h1>Collections</h1>
        <p>
          Explore curated lists of top restaurants, cafes, pubs, and bars in Hyderabad, based on trends.
        </p>
        

      </div>
      <div className="collections-container">
        {restraunts_list.map((restaurant) => (
          <div className="collections-card" key={restaurant._id}>
            <img src={restaurant.image} alt={restaurant.name} className="card-image" />
            <div className="card-overlay">
              <h3>{restaurant.name}</h3>
              <div className="rating-container">
                <img src={assets.rating_starts} alt="Rating Stars" className="rating-stars" />
              </div>
              <p>{restaurant.places}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Collections;
