import React, { useState, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { Plus, Minus, Check, Star } from 'lucide-react';
import Button from '../../components/ui/Button';
import './OnlineOrder.css';

const OnlineOrder = ({ restaurant }) => {
  const [selectedMenu, setSelectedMenu] = useState(restaurant.menus[0]);
  const { cartItems, addToCart, removeFromCart, food_list } = useContext(StoreContext);

  const menuItems = restaurant.menuItems[selectedMenu] || [];

  return (
    <div className="online-order">
      {/* Left Column: Menu Category Selector */}
      <div className="menu-navbar" role="tablist">
        <ul>
          {restaurant.menus.map((menu, index) => (
            <li
              key={index}
              role="tab"
              aria-selected={selectedMenu === menu}
              className={selectedMenu === menu ? 'active' : ''}
              onClick={() => setSelectedMenu(menu)}
            >
              {menu}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Column: Menu Items Grid */}
      <div className="menu-items">
        <h2 className="current-menu-title">{selectedMenu}</h2>

        <div className="items-list-grid">
          {menuItems.map((item, index) => {
            // Find matched food_list id or use item.id
            const matchedFood = food_list.find((f) => f.name.toLowerCase() === item.name.toLowerCase());
            const itemId = matchedFood ? matchedFood._id : item.id || `dish-${index}`;
            const count = cartItems[itemId] || 0;

            return (
              <div key={index} className="item-card">
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <div className="item-top-line">
                    <h3 className="item-name">{item.name}</h3>
                    <span className="item-cost">${item.price.toFixed(2)}</span>
                  </div>

                  <p className="item-description">{item.description}</p>

                  <div className="item-bottom-bar">
                    <div className="item-rating">
                      <Star size={12} fill="currentColor" /> {item.rating}
                    </div>

                    <div className="cart-item-actions">
                      {count === 0 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Plus size={14} />}
                          onClick={() => addToCart(itemId)}
                        >
                          Add to Cart
                        </Button>
                      ) : (
                        <div className="dish-counter-pill">
                          <button
                            type="button"
                            onClick={() => removeFromCart(itemId)}
                            className="dish-counter-btn"
                            aria-label={`Remove one ${item.name}`}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="dish-count-num">{count}</span>
                          <button
                            type="button"
                            onClick={() => addToCart(itemId)}
                            className="dish-counter-btn"
                            aria-label={`Add another ${item.name}`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OnlineOrder;