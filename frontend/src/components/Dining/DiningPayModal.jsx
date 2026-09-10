import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Tag, 
  Sparkles, 
  CheckCircle2, 
  Receipt, 
  DollarSign, 
  ShieldCheck,
  Percent
} from 'lucide-react';
import Button from '../ui/Button';
import './DiningPayModal.css';

const TIP_OPTIONS = [0, 5, 10, 15, 20];

const DiningPayModal = ({ reservation, onClose, onPaymentSuccess }) => {
  const [billAmountStr, setBillAmountStr] = useState('120.00');
  const [tipPercent, setTipPercent] = useState(10);
  const [paymentMethod, setPaymentMethod] = useState('Apple Pay / Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState(null);

  const billAmount = parseFloat(billAmountStr) || 0;
  const discountPercent = reservation?.discountPercent || 20;
  const discountAmount = (billAmount * discountPercent) / 100;
  const subtotalAfterDiscount = Math.max(0, billAmount - discountAmount);
  const tipAmount = (subtotalAfterDiscount * tipPercent) / 100;
  const totalAmountToPay = subtotalAfterDiscount + tipAmount;

  const handlePay = async (e) => {
    e.preventDefault();
    if (billAmount <= 0) return;

    setIsProcessing(true);
    // Simulate brief payment gateway authorization
    setTimeout(async () => {
      const result = await onPaymentSuccess(reservation.id, {
        billAmount,
        tipAmount,
        paymentMethod,
      });
      setIsProcessing(false);
      setPaidReceipt({
        ...result,
        reference: reservation.bookingReference,
        restaurantName: reservation.restaurantName,
        totalPaid: totalAmountToPay,
        discount: discountAmount,
        tip: tipAmount,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }, 1200);
  };

  return (
    <div className="dining-modal-backdrop fade-in" onClick={onClose}>
      <div className="dining-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close-modal-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {!paidReceipt ? (
          <form onSubmit={handlePay} className="dining-pay-form">
            <div className="pay-modal-header">
              <div className="pay-icon-wrap">
                <Receipt size={24} />
              </div>
              <h2 className="modal-title">Tomato Dining Pay</h2>
              <p className="modal-sub">
                Pay your bill at <strong>{reservation.restaurantName}</strong> and unlock instant table savings.
              </p>
            </div>

            {/* Applied Perk Banner */}
            <div className="perk-applied-alert">
              <Sparkles size={16} className="perk-sparkle" />
              <span>
                <strong>{discountPercent}% Table Reservation Discount</strong> automatically applied to your check!
              </span>
            </div>

            {/* Bill Input */}
            <div className="modal-form-group">
              <label className="modal-input-label">Enter Food & Drink Bill Amount ($)</label>
              <div className="currency-input-wrap">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  value={billAmountStr}
                  onChange={(e) => setBillAmountStr(e.target.value)}
                  placeholder="0.00"
                  className="bill-number-input"
                  required
                />
              </div>
            </div>

            {/* Tip Selection */}
            <div className="modal-form-group">
              <label className="modal-input-label">Add Tip for Waitstaff</label>
              <div className="tips-selector-row">
                {TIP_OPTIONS.map((tip) => (
                  <button
                    type="button"
                    key={tip}
                    className={`tip-btn ${tipPercent === tip ? 'active' : ''}`}
                    onClick={() => setTipPercent(tip)}
                  >
                    {tip === 0 ? 'No Tip' : `${tip}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Summary Box */}
            <div className="bill-breakdown-box">
              <div className="breakdown-row">
                <span>Original Bill Amount</span>
                <span>${billAmount.toFixed(2)}</span>
              </div>
              <div className="breakdown-row text-emerald">
                <span>Table Discount ({discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
              <div className="breakdown-row">
                <span>Staff Tip ({tipPercent}%)</span>
                <span>+${tipAmount.toFixed(2)}</span>
              </div>
              <div className="breakdown-divider" />
              <div className="breakdown-row total">
                <strong>Final Amount to Pay</strong>
                <strong className="total-num">${totalAmountToPay.toFixed(2)}</strong>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="modal-form-group">
              <label className="modal-input-label">Payment Method</label>
              <div className="payment-pills-row">
                {['Apple Pay / Google Pay', 'Credit / Debit Card', 'UPI / NetBanking'].map((method) => (
                  <button
                    type="button"
                    key={method}
                    className={`method-pill ${paymentMethod === method ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-actions-footer">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="pay-submit-btn"
                disabled={isProcessing || billAmount <= 0}
              >
                {isProcessing ? 'Authorizing Payment...' : `Pay $${totalAmountToPay.toFixed(2)} with Tomato Pay`}
              </Button>
            </div>
          </form>
        ) : (
          <div className="payment-success-card">
            <div className="receipt-success-icon">
              <CheckCircle2 size={44} />
            </div>
            <h2 className="receipt-title">Payment Successful!</h2>
            <p className="receipt-sub">Your dining bill has been settled directly with the restaurant.</p>

            <div className="receipt-docket">
              <div className="receipt-header">
                <strong>{paidReceipt.restaurantName}</strong>
                <span>Ref: {paidReceipt.reference}</span>
              </div>
              <div className="receipt-divider" />
              <div className="receipt-row">
                <span>Original Bill:</span>
                <span>${billAmount.toFixed(2)}</span>
              </div>
              <div className="receipt-row text-emerald">
                <span>Dining Discount:</span>
                <span>-${paidReceipt.discount.toFixed(2)}</span>
              </div>
              <div className="receipt-row">
                <span>Staff Tip:</span>
                <span>+${paidReceipt.tip.toFixed(2)}</span>
              </div>
              <div className="receipt-divider" />
              <div className="receipt-row final">
                <strong>Total Paid:</strong>
                <strong>${paidReceipt.totalPaid.toFixed(2)}</strong>
              </div>
              <div className="receipt-footer">
                <span>Paid via {paymentMethod} at {paidReceipt.timestamp}</span>
              </div>
            </div>

            <div className="receipt-actions">
              <Button variant="primary" onClick={onClose}>
                Done & Return to Bookings
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiningPayModal;
