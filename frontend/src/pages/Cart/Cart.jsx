import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Toast from '../../components/ui/Toast';
import './Cart.css';

const Cart = () => {
  const {
    cartItems,
    food_list,
    addToCart,
    removeFromCart,
    deleteFromCart,
    getTotalCartAmount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState(null);

  // Cart items data
  const cartData = food_list.filter((item) => cartItems[item._id] > 0);
  const subtotal = getTotalCartAmount();
  const freeDeliveryThreshold = 50.0;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deliveryFee = subtotal === 0 ? 0.0 : isFreeDelivery ? 0.0 : 2.0;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const tax = Number((subtotal * 0.05).toFixed(2));

  // Discount calculation
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discount = Number(((subtotal * appliedPromo.value) / 100).toFixed(2));
    } else {
      discount = appliedPromo.value;
    }
  }

  const finalTotal = Math.max(0, Number((subtotal + deliveryFee + tax - discount).toFixed(2)));

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const res = applyPromoCode(promoInput);
    setPromoMessage({ text: res.message, type: res.success ? 'success' : 'error' });
    if (res.success) setPromoInput('');
  };

  const handleConfirmDelete = () => {
    if (deleteCandidateId) {
      deleteFromCart(deleteCandidateId);
      setDeleteCandidateId(null);
    }
  };

  return (
    <div className="cart-page fade-in">
      <div className="cart-page-header">
        <h1 className="cart-title">Your Order Cart</h1>
        <p className="cart-subtitle">
          Review your items, apply vouchers, and proceed to secure checkout.
        </p>
      </div>

      {promoMessage && (
        <Toast
          message={promoMessage.text}
          type={promoMessage.type}
          onClose={() => setPromoMessage(null)}
        />
      )}

      {cartData.length === 0 ? (
        <div className="cart-empty-container">
          <div className="cart-empty-illustration">🛒</div>
          <h2>Your cart is currently empty</h2>
          <p>Explore our curated restaurant menus and add delicious dishes to begin.</p>
          <Button variant="primary" size="lg" onClick={() => navigate('/explore-menu')}>
            Explore Menu Catalog
          </Button>
        </div>
      ) : (
        <div className="cart-content-grid">
          {/* Left Column: Cart Items List */}
          <div className="cart-items-section">
            {/* Free Delivery Meter */}
            <div className="free-delivery-card">
              <div className="meter-header">
                <Sparkles size={18} className="meter-icon" />
                <span className="meter-text">
                  {isFreeDelivery
                    ? '🎉 You have unlocked FREE Delivery!'
                    : `Add $${amountToFreeDelivery.toFixed(2)} more to unlock FREE Delivery`}
                </span>
              </div>
              <div className="meter-progress-track">
                <div
                  className="meter-progress-bar"
                  style={{
                    width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Items Table */}
            <div className="cart-items-table-wrapper">
              <div className="cart-items-head">
                <span className="col-item">Item</span>
                <span className="col-price">Price</span>
                <span className="col-qty">Quantity</span>
                <span className="col-total">Subtotal</span>
                <span className="col-action">Remove</span>
              </div>

              <div className="cart-items-body">
                {cartData.map((item) => {
                  const qty = cartItems[item._id];
                  const itemTotal = (item.price * qty).toFixed(2);
                  return (
                    <div key={item._id} className="cart-row">
                      <div className="col-item item-cell">
                        <img src={item.image} alt={item.name} className="cart-item-thumb" />
                        <div className="item-info">
                          <h3 className="cart-item-name">{item.name}</h3>
                          <span className="cart-item-cat">{item.category}</span>
                        </div>
                      </div>

                      <div className="col-price price-cell">
                        ${item.price.toFixed(2)}
                      </div>

                      <div className="col-qty qty-cell">
                        <div className="qty-stepper">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item._id)}
                            aria-label={`Decrease ${item.name} quantity`}
                            className="stepper-btn"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="stepper-count">{qty}</span>
                          <button
                            type="button"
                            onClick={() => addToCart(item._id)}
                            aria-label={`Increase ${item.name} quantity`}
                            className="stepper-btn"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="col-total total-cell">
                        ${itemTotal}
                      </div>

                      <div className="col-action action-cell">
                        <button
                          type="button"
                          onClick={() => setDeleteCandidateId(item._id)}
                          aria-label={`Delete ${item.name} from cart`}
                          className="delete-item-btn"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Secondary Controls */}
            <div className="cart-items-actions">
              <Button variant="ghost" onClick={() => navigate('/explore-menu')}>
                ← Add More Items
              </Button>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="cart-summary-section">
            <div className="summary-card">
              <h2 className="summary-title">Order Summary</h2>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="promo-form">
                <div className="promo-input-group">
                  <Tag size={16} className="promo-icon" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. SAVE10)"
                    className="promo-input"
                    aria-label="Promo code"
                  />
                  <Button type="submit" size="sm" variant="secondary">
                    Apply
                  </Button>
                </div>
              </form>

              {appliedPromo && (
                <div className="applied-promo-badge">
                  <span>
                    Coupon <strong>{appliedPromo.code}</strong> applied ({appliedPromo.type === 'percent' ? `${appliedPromo.value}% off` : `$${appliedPromo.value} off`})
                  </span>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="remove-promo-btn"
                    aria-label="Remove promo code"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="summary-breakdown">
                <div className="breakdown-row">
                  <span>Item Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="breakdown-row">
                  <span>Delivery Fee</span>
                  <span>
                    {isFreeDelivery ? (
                      <span className="free-badge">FREE</span>
                    ) : (
                      `$${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="breakdown-row">
                  <span>Estimated Taxes & GST (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="breakdown-row discount-row">
                    <span>Promo Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="breakdown-divider" />
                <div className="breakdown-row total-row">
                  <span>Total Amount</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={18} />}
                onClick={() => navigate('/order')}
                className="checkout-btn"
              >
                Proceed to Checkout (${finalTotal.toFixed(2)})
              </Button>

              <div className="secure-badge">
                <ShieldCheck size={16} />
                <span>Encrypted 256-bit checkout with buyer protection</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteCandidateId}
        title="Remove Item from Cart"
        message="Are you sure you want to remove this dish from your order?"
        confirmText="Remove"
        cancelText="Keep"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteCandidateId(null)}
      />
    </div>
  );
};

export default Cart;
