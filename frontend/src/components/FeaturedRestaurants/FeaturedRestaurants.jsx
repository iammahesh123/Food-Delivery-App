import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { Star, Clock, Bike, ArrowRight, ShieldCheck } from 'lucide-react';
import './FeaturedRestaurants.css';

const RESTAURANT_META = {
  '1': { cuisines: 'Burgers • Fast Food • American', time: '20-30 min', fee: 'Free Delivery', rating: '4.5', promo: '20% OFF' },
  '2': { cuisines: 'Pizza • Italian • Garlic Breads', time: '25-35 min', fee: '$1.49 Delivery', rating: '4.7', promo: 'Free Garlic Bread' },
  '3': { cuisines: 'Fried Chicken • Wings • Combos', time: '15-25 min', fee: 'Free Delivery', rating: '4.6', promo: '$5 OFF > $25' },
  '4': { cuisines: 'Subs • Salads • Healthy Wraps', time: '20-30 min', fee: 'Free Delivery', rating: '4.8', promo: 'Buy 1 Get 1' },
};

const FeaturedRestaurants = () => {
  const { restaurants_data } = useContext(StoreContext);

  if (!restaurants_data || restaurants_data.length === 0) return null;

  return (
    <div className="featured-restaurants-section">
      <div className="section-header-row">
        <div>
          <div className="section-eyebrow">
            <ShieldCheck size={16} className="text-orange" />
            <span>Handpicked Partners</span>
          </div>
          <h2 className="section-main-heading">Top Rated Restaurants Near You</h2>
          <p className="section-sub-heading">Order from city favorites with verified hygiene and fastest courier arrival times.</p>
        </div>
        <Link to="/restaurants" className="section-view-all-btn">
          <span>View All Restaurants</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="restaurants-grid">
        {restaurants_data.map((restaurant) => {
          const meta = RESTAURANT_META[restaurant.id] || {
            cuisines: 'Multi-Cuisine • Gourmet',
            time: '25-35 min',
            fee: 'Free Delivery',
            rating: restaurant.rating || '4.5',
            promo: 'Featured Partner',
          };

          return (
            <Link
              to={`/restaurant/${restaurant.id}`}
              key={restaurant.id}
              className="restaurant-spotlight-card"
            >
              <div className="card-image-wrap">
                <img src={restaurant.image} alt={restaurant.name} className="restaurant-thumb" />
                <div className="card-top-badges">
                  <span className="promo-badge">{meta.promo}</span>
                  <div className="rating-pill">
                    <Star size={13} className="star-icon" />
                    <span>{meta.rating}</span>
                  </div>
                </div>
                <div className="eta-pill">
                  <Clock size={13} />
                  <span>{meta.time}</span>
                </div>
              </div>

              <div className="card-info-wrap">
                <div className="restaurant-header">
                  <h3 className="restaurant-name">{restaurant.name}</h3>
                  <span className="restaurant-fee">{meta.fee}</span>
                </div>

                <p className="restaurant-cuisines">{meta.cuisines}</p>

                <div className="restaurant-footer">
                  <span className="restaurant-address">{restaurant.address}</span>
                  <span className="view-menu-tag">
                    <span>Menu</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedRestaurants;
