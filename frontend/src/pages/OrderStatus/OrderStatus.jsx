import React, { useContext, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  PackageCheck,
  XCircle,
  Phone,
  MapPin,
  FileText,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Toast from '../../components/ui/Toast';
import './OrderStatus.css';

const STEPS = [
  { key: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle2, desc: 'Merchant received order' },
  { key: 'PREPARING', label: 'Kitchen Preparing', icon: ChefHat, desc: 'Chef preparing fresh dishes' },
  { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', icon: Clock, desc: 'Packed and ready for courier' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Bike, desc: 'Courier en route to address' },
  { key: 'DELIVERED', label: 'Delivered', icon: PackageCheck, desc: 'Handed over successfully' },
];

const OrderStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById, cancelOrder } = useContext(StoreContext);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="order-not-found fade-in">
        <AlertTriangle size={48} className="error-icon" />
        <h2>Order Not Found</h2>
        <p>We couldn't locate order reference #{orderId}.</p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Return to Marketplace
        </Button>
      </div>
    );
  }

  const isCanceled = order.status === 'CANCELED';
  const currentStepIndex = STEPS.findIndex((s) => s.key === order.status);

  const handleCancelOrder = () => {
    cancelOrder(order.id, 'Canceled by customer');
    setShowCancelModal(false);
    setToastMessage({ text: 'Order has been successfully canceled.', type: 'info' });
  };

  return (
    <div className="order-status-page fade-in">
      {toastMessage && (
        <Toast
          message={toastMessage.text}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Header Bar */}
      <div className="order-status-header">
        <div className="header-breadcrumbs">
          <Link to="/my-orders" className="back-link">
            <ArrowLeft size={16} /> All Orders
          </Link>
          <span className="order-id-chip">Order Reference: {order.id}</span>
        </div>
        <div className="header-status-badge">
          <Badge variant={order.status.toLowerCase()} size="lg">
            ● {order.status.replace(/_/g, ' ')}
          </Badge>
        </div>
      </div>

      <div className="order-status-grid">
        {/* Left Column: Live Progress Stepper */}
        <div className="order-live-card">
          {isCanceled ? (
            <div className="canceled-banner">
              <XCircle size={32} />
              <div>
                <h3>This order was canceled</h3>
                <p>{order.cancelReason || 'Order was stopped prior to fulfillment.'}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="eta-banner">
                <div className="eta-icon-wrap">
                  <Clock size={28} />
                </div>
                <div className="eta-info">
                  <span className="eta-label">Estimated Delivery Arrival</span>
                  <h2 className="eta-time">
                    {order.status === 'DELIVERED'
                      ? 'Delivered to your address'
                      : `${order.etaMinutes} Minutes`}
                  </h2>
                </div>
              </div>

              {/* Visual Progress Stepper */}
              <div className="status-stepper" role="list">
                {STEPS.map((step, idx) => {
                  const isDone = currentStepIndex > idx || order.status === 'DELIVERED';
                  const isCurrent = currentStepIndex === idx && order.status !== 'DELIVERED';
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.key}
                      className={`stepper-node ${isDone ? 'step-done' : ''} ${isCurrent ? 'step-current' : ''}`}
                      role="listitem"
                    >
                      <div className="node-icon-circle">
                        <StepIcon size={20} />
                      </div>
                      <div className="node-content">
                        <h4 className="node-title">{step.label}</h4>
                        <p className="node-desc">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Delivery Personnel Details */}
          {!isCanceled && order.status !== 'DELIVERED' && (
            <div className="driver-card">
              <div className="driver-avatar">🚴‍♂️</div>
              <div className="driver-meta">
                <span className="driver-label">Assigned Delivery Partner</span>
                <h4 className="driver-name">{order.driverName}</h4>
                <span className="driver-vehicle">Express Courier (Verified)</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Phone size={14} />}
                onClick={() => alert(`Calling courier partner at ${order.driverPhone}...`)}
              >
                Call Driver
              </Button>
            </div>
          )}

          {/* Cancellation Option (Only while confirming or preparing) */}
          {!isCanceled && (order.status === 'CONFIRMED' || order.status === 'PREPARING') && (
            <div className="order-cancel-section">
              <Button
                variant="ghost"
                size="sm"
                className="cancel-btn"
                onClick={() => setShowCancelModal(true)}
              >
                Need to cancel this order?
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Order Docket Details */}
        <div className="order-docket-card">
          <div className="docket-header">
            <FileText size={20} className="docket-icon" />
            <h3 className="docket-title">Order Receipt & Details</h3>
          </div>

          <div className="docket-meta-section">
            <div className="meta-row">
              <span className="meta-label">Restaurant</span>
              <span className="meta-val">{order.restaurantName}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Order Placed</span>
              <span className="meta-val">{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Payment Method</span>
              <span className="meta-val">{order.paymentMethod} ({order.paymentStatus})</span>
            </div>
          </div>

          <div className="docket-address">
            <MapPin size={16} className="pin-icon" />
            <div>
              <span className="address-label">Delivery Address:</span>
              <p className="address-text">{order.deliveryAddress}</p>
            </div>
          </div>

          <div className="docket-divider" />

          {/* Itemized list */}
          <div className="docket-items-list">
            {order.items.map((it, idx) => (
              <div key={idx} className="docket-item-row">
                <span className="item-multiplier">{it.quantity}x</span>
                <span className="item-title">{it.name}</span>
                <span className="item-price">${(it.price * it.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="docket-divider" />

          {/* Pricing breakdown */}
          <div className="docket-pricing">
            <div className="pricing-row">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="pricing-row">
              <span>Delivery Fee</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="pricing-row">
              <span>Taxes & GST</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="pricing-row discount-row">
                <span>Discount Applied</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="pricing-row total-row">
              <span>Total Paid</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelModal}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? The restaurant may already have begun preparation."
        confirmText="Confirm Cancellation"
        cancelText="Keep Order"
        variant="destructive"
        onConfirm={handleCancelOrder}
        onClose={() => setShowCancelModal(false)}
      />
    </div>
  );
};

export default OrderStatus;
