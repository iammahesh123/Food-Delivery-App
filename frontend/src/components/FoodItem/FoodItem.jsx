import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { Plus, Minus, Star, Sparkles } from 'lucide-react';
import './FoodItem.css';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
  const count = cartItems[id] || 0;

  return (
    <div className="modern-food-card fade-in">
      <div className="card-thumb-wrapper">
        <img className="dish-cover-img" src={image} alt={name} loading="lazy" />
        <span className="price-tag-floating">${price.toFixed(2)}</span>
      </div>

      <div className="dish-card-body">
        <div className="dish-title-row">
          <h3 className="dish-heading">{name}</h3>
          <div className="dish-rating-badge">
            <Star size={12} fill="currentColor" /> 4.8
          </div>
        </div>

        <p className="dish-snippet">{description}</p>

        <div className="dish-card-footer">
          <div className="dish-calories">Chef's Special</div>

          {count === 0 ? (
            <button
              type="button"
              className="quick-add-btn"
              onClick={() => addToCart(id)}
              aria-label={`Add ${name} to cart`}
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          ) : (
            <div className="dish-stepper-pill">
              <button
                type="button"
                className="stepper-action-btn"
                onClick={() => removeFromCart(id)}
                aria-label={`Decrease ${name} quantity`}
              >
                <Minus size={14} />
              </button>
              <span className="stepper-val">{count}</span>
              <button
                type="button"
                className="stepper-action-btn"
                onClick={() => addToCart(id)}
                aria-label={`Increase ${name} quantity`}
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;