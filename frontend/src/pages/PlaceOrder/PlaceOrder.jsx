import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import {
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import './PlaceOrder.css';

const PlaceOrder = () => {
  const { cartItems, food_list, getTotalCartAmount, appliedPromo, createOrder, userProfile } =
    useContext(StoreContext);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    firstName: userProfile.name ? userProfile.name.split(' ')[0] : 'Sarah',
    lastName: userProfile.name ? userProfile.name.split(' ')[1] || 'Jenkins' : 'Jenkins',
    email: userProfile.email || 'sarah.j@example.com',
    phone: '+1 (555) 234-8901',
    street: '123 Elm Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    pinCode: '10001',
    instructions: 'Please leave at the front desk with reception.',
    paymentMethod: 'Credit Card', // 'Credit Card' | 'UPI' | 'Cash on Delivery'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cart summary calculations
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal > 50 ? 0.0 : 2.0;
  const tax = Number((subtotal * 0.05).toFixed(2));
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discount = Number(((subtotal * appliedPromo.value) / 100).toFixed(2));
    } else {
      discount = appliedPromo.value;
    }
  }
  const finalTotal = Math.max(0, Number((subtotal + deliveryFee + tax - discount).toFixed(2)));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required for tracking.';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required for delivery contact.';
    if (!formData.street.trim()) newErrors.street = 'Delivery address street is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (!formData.pinCode.trim()) newErrors.pinCode = 'Postal / Zip code is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const createdOrder = createOrder(formData);
      setIsSubmitting(false);
      navigate(`/orders/${createdOrder.id}`);
    }, 900);
  };

  if (subtotal === 0) {
    return (
      <div className="checkout-empty-state fade-in">
        <AlertCircle size={48} className="empty-icon" />
        <h2>Your cart has no active items</h2>
        <p>Please select items from our menu before proceeding to checkout.</p>
        <Button variant="primary" onClick={() => navigate('/explore-menu')}>
          Return to Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="place-order-page fade-in">
      <div className="checkout-header">
        <h1 className="checkout-title">Checkout & Order Placement</h1>
        <div className="checkout-steps-indicator">
          <span className="step done">1. Cart</span>
          <span className="step-arrow">→</span>
          <span className="step active">2. Delivery & Payment</span>
          <span className="step-arrow">→</span>
          <span className="step">3. Live Confirmation</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="checkout-form-grid">
        {/* Left Column: Delivery & Payment Details */}
        <div className="checkout-main-content">
          {/* Section 1: Delivery Address */}
          <div className="checkout-card">
            <div className="card-header">
              <div className="card-header-icon">
                <MapPin size={20} />
              </div>
              <div>
                <h2 className="card-title">1. Delivery Address</h2>
                <p className="card-desc">Where should we deliver your order?</p>
              </div>
            </div>

            <div className="form-fields-row">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                required
              />
            </div>

            <div className="form-fields-row">
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                helperText="Order receipts and live status will be sent here."
                required
              />
              <Input
                label="Mobile Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                helperText="Driver will call this number upon arrival."
                required
              />
            </div>

            <Input
              label="Street Address & Apartment/Suite"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              error={errors.street}
              placeholder="e.g. 123 Main St, Apt 4B"
              required
            />

            <div className="form-fields-grid-3">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                error={errors.city}
                required
              />
              <Input
                label="State / Province"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              />
              <Input
                label="Postal / Zip Code"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
                error={errors.pinCode}
                required
              />
            </div>

            <Input
              label="Delivery Instructions (Optional)"
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              placeholder="Gate code, door drop-off instructions, ring bell..."
            />
          </div>

          {/* Section 2: Payment Method */}
          <div className="checkout-card">
            <div className="card-header">
              <div className="card-header-icon">
                <CreditCard size={20} />
              </div>
              <div>
                <h2 className="card-title">2. Payment Method</h2>
                <p className="card-desc">Select how you would like to settle your order.</p>
              </div>
            </div>

            <div className="payment-options-grid" role="radiogroup" aria-label="Payment method">
              <label
                className={`payment-option-card ${formData.paymentMethod === 'Credit Card' ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Credit Card"
                  checked={formData.paymentMethod === 'Credit Card'}
                  onChange={handleInputChange}
                />
                <div className="option-content">
                  <div className="option-title">
                    <span>Credit or Debit Card</span>
                    <span className="card-brands">💳 Visa / MC</span>
                  </div>
                  <p className="option-desc">Instant secure authorization via 256-bit PCI gateway.</p>
                </div>
              </label>

              <label
                className={`payment-option-card ${formData.paymentMethod === 'UPI' ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI"
                  checked={formData.paymentMethod === 'UPI'}
                  onChange={handleInputChange}
                />
                <div className="option-content">
                  <div className="option-title">
                    <span>UPI / Instant QR Payment</span>
                    <span className="card-brands">⚡ Fast</span>
                  </div>
                  <p className="option-desc">Pay instantly using Google Pay, PhonePe, or Apple Pay.</p>
                </div>
              </label>

              <label
                className={`payment-option-card ${formData.paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={formData.paymentMethod === 'Cash on Delivery'}
                  onChange={handleInputChange}
                />
                <div className="option-content">
                  <div className="option-title">
                    <span>Cash on Delivery (COD)</span>
                    <span className="card-brands">💵 Pay at door</span>
                  </div>
                  <p className="option-desc">Pay with cash or card upon receiving your order docket.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Confirmation Summary */}
        <div className="checkout-summary-sidebar">
          <div className="checkout-receipt-card">
            <h3 className="receipt-title">Order Summary</h3>
            <div className="receipt-restaurant">
              <Truck size={16} />
              <span>Fulfilling from: <strong>Delicious Bites</strong></span>
            </div>

            <div className="receipt-items-list">
              {food_list
                .filter((item) => cartItems[item._id] > 0)
                .map((item) => (
                  <div key={item._id} className="receipt-item-row">
                    <span className="item-qty">{cartItems[item._id]}x</span>
                    <span className="item-name">{item.name}</span>
                    <span className="item-total">
                      ${(item.price * cartItems[item._id]).toFixed(2)}
                    </span>
                  </div>
                ))}
            </div>

            <div className="receipt-divider" />

            <div className="receipt-breakdown">
              <div className="breakdown-line">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="breakdown-line">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="breakdown-line">
                <span>Estimated Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="breakdown-line discount-line">
                  <span>Promo Discount ({appliedPromo?.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="receipt-divider" />
              <div className="breakdown-line total-line">
                <span>Total Due</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight size={18} />}
              className="place-order-btn"
            >
              Place Order & Pay ${finalTotal.toFixed(2)}
            </Button>

            <div className="receipt-guarantee">
              <ShieldCheck size={16} />
              <span>Full refund guarantee if preparation SLA is breached</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
