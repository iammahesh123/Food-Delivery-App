import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromCart } = useContext(StoreContext);

  const navigate = useNavigate();

  const cartData = food_list.filter(item => cartItems[item._id] > 0);

  const calculateSubTotal = () => {
    return cartData
      .reduce((total, item) => total + item.price * cartItems[item._id], 0)
      .toFixed(2);
  };

  const deliveryFee = 2.0;
  const totalAmount = (parseFloat(calculateSubTotal()) + deliveryFee).toFixed(2);

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Image</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr className="cart-divider" />
        {cartData.length > 0 ? (
          cartData.map((item, index) => (
            <React.Fragment key={item._id}>
              <div className="cart-item-title cart-items-item">
                <img src={item.image} alt={item.name} />
                <p>{item.name}</p>
                <p>${item.price.toFixed(2)}</p>
                <p>{cartItems[item._id]}</p>
                <p>${(item.price * cartItems[item._id]).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item._id)}>X</button>
              </div>
              {index < cartData.length - 1 && <hr className="cart-divider" />}
            </React.Fragment>
          ))
        ) : (
          <p className="empty-cart-message">Your cart is empty!</p>
        )}
      </div>
      {cartData.length > 0 && (
        <div className="cart-bottom">
          <hr />
          <div className="cart-promocode">
            <p>If you have a promo code, enter it here:</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Promo code" />
              <button className="promo-button">Submit</button>
            </div>
          </div>
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Sub-total</p>
                <p>${calculateSubTotal()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${deliveryFee.toFixed(2)}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>${totalAmount}</b>
              </div>
            </div>
            <button onClick={() => navigate('/order')} className="checkout-button">PROCEED TO CHECKOUT</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
