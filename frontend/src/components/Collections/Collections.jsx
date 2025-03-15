import React from 'react';
import './Collection.css';
import { assets, restraunts_list } from '../../assets/assets';
import { Link } from 'react-router-dom';

const Collections = () => {
  const scrollContainerRef = React.useRef();

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <>
      {/* <div className='collections-banner-container'>
        <img src={assets.christmas_img} alt="Collections Banner" className="collections-banner" />
      </div> */}
      <div className="collections">
        <h1>Collections</h1>
        <p>
          Explore curated lists of top restaurants, cafes, pubs, and bars in Hyderabad, based on trends.
        </p>
      </div>
      <div className="collections-wrapper">
        <button className="scroll-button left" onClick={scrollLeft}>
          &#9664;
        </button>
        <div className="collections-container" ref={scrollContainerRef}>
          {restraunts_list.map((restaurant) => (
            <div className="collections-card" key={restaurant._id}>
              <img src={restaurant.image} alt={`Image of ${restaurant.name}`} className="card-image" />
              <div className="card-overlay">
              <Link to={`/collections/${restaurant.name.toLowerCase().replace(/ /g, '-')}`}>
                  <h3>{restaurant.name}</h3>
                </Link>
                <div className="rating-container">
                  <img src={assets.rating_starts} alt="Rating Stars" className="rating-stars" />
                </div>
                <p>{restaurant.places}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="scroll-button right" onClick={scrollRight}>
          &#9654;
        </button>
      </div>
    </>
  );
};

export default Collections;
