import React, { useContext } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';

const PlaceOrder = () => {
  const { getTotalCartAmount } = useContext(StoreContext);
  
  const deliveryFee = 2.0;
  const totalAmount = (parseFloat(getTotalCartAmount()) + deliveryFee).toFixed(2);

  return (
    <form className="place-order">
      {/* Left Section: Delivery Information */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input type="text" placeholder="First name" name="firstName" />
          <input type="text" placeholder="Last name" name="lastName" />
        </div>
        <input type="email" placeholder="Email address" name="email" />
        <input type="text" placeholder="Street" name="street" />
        <div className="multi-fields">
          <input type="text" placeholder="City" name="city" />
          <input type="text" placeholder="State" name="state" />
        </div>
        <div className="multi-fields">
          <input type="text" placeholder="Pin Code" name="pinCode" />
          <input type="text" placeholder="Country" name="country" />
        </div>
        <input type="text" placeholder="Phone" name="phone" />
      </div>

      {/* Right Section: Cart Totals */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Sub-total</p>
              <p>${getTotalCartAmount()}</p>
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
          <button type="button" className="checkout-button">
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
