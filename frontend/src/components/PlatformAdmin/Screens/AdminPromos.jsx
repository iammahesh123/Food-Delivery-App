import React, { useState } from 'react';
import {
  BadgePercent,
  Plus,
  Trash2,
  Calendar,
  CheckCircle,
  Copy,
  DollarSign,
  Layers,
  Sparkles,
  X
} from 'lucide-react';
import './AdminPromos.css';

const AdminPromos = () => {
  const [promos, setPromos] = useState([
    { id: 1, code: 'WELCOME50', discountPercent: 50, minOrderAmount: 20, maxDiscountAmount: 15, usageCount: 842, maxUses: 1000, expiryDate: '2026-12-31', active: true },
    { id: 2, code: 'FESTIVE20', discountPercent: 20, minOrderAmount: 30, maxDiscountAmount: 25, usageCount: 418, maxUses: 500, expiryDate: '2026-11-30', active: true },
    { id: 3, code: 'DININGVIP', discountPercent: 25, minOrderAmount: 50, maxDiscountAmount: 40, usageCount: 120, maxUses: 200, expiryDate: '2026-10-31', active: true },
    { id: 4, code: 'FREESHIP', discountPercent: 100, minOrderAmount: 15, maxDiscountAmount: 5, usageCount: 1520, maxUses: 2000, expiryDate: '2026-12-15', active: true },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const [newPromo, setNewPromo] = useState({
    code: '',
    discountPercent: 20,
    minOrderAmount: 25,
    maxDiscountAmount: 15,
    maxUses: 500,
    expiryDate: '2026-12-31'
  });

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleCreatePromo = (e) => {
    e.preventDefault();
    if (!newPromo.code.trim()) return;

    const created = {
      id: Date.now(),
      code: newPromo.code.toUpperCase(),
      discountPercent: Number(newPromo.discountPercent) || 10,
      minOrderAmount: Number(newPromo.minOrderAmount) || 0,
      maxDiscountAmount: Number(newPromo.maxDiscountAmount) || 20,
      usageCount: 0,
      maxUses: Number(newPromo.maxUses) || 500,
      expiryDate: newPromo.expiryDate,
      active: true
    };

    setPromos([created, ...promos]);
    setShowAddModal(false);
    setNewPromo({
      code: '',
      discountPercent: 20,
      minOrderAmount: 25,
      maxDiscountAmount: 15,
      maxUses: 500,
      expiryDate: '2026-12-31'
    });
  };

  return (
    <div className="admin-promos-page">
      <div className="admin-page-header">
        <div>
          <div className="admin-pre-title">DISCOUNT ENGINE & SETTLEMENTS</div>
          <h1 className="admin-main-heading">Platform Financials & Promo Codes</h1>
          <p className="admin-sub-heading">
            Configure global coupons, promotional subsidies, partner payouts, and platform take rates.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-btn"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} />
          <span>Create Promo Voucher</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="promos-summary-grid">
        <div className="promo-stat-box">
          <span className="stat-label">TOTAL DISCOUNTS SUBSIDIZED</span>
          <div className="stat-val">$14,280.00</div>
          <span className="stat-hint">Across 2,900 customer checkouts</span>
        </div>
        <div className="promo-stat-box">
          <span className="stat-label">ACTIVE PROMO CAMPAIGNS</span>
          <div className="stat-val">{promos.filter((p) => p.active).length} Active</div>
          <span className="stat-hint">Global vouchers active</span>
        </div>
        <div className="promo-stat-box">
          <span className="stat-label">MERCHANT PAYOUTS QUEUED</span>
          <div className="stat-val">$38,940.50</div>
          <span className="stat-hint">Next settlement cycle: Friday</span>
        </div>
      </div>

      {/* Promos Table */}
      <div className="admin-table-container">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Voucher Code</th>
              <th>Discount Rate</th>
              <th>Min Order Requirement</th>
              <th>Max Cap ($)</th>
              <th>Redemption Progress</th>
              <th>Valid Until</th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p) => {
              const percent = Math.min(100, Math.round((p.usageCount / p.maxUses) * 100));

              return (
                <tr key={p.id}>
                  <td>
                    <div className="promo-code-chip-wrap">
                      <span className="promo-code-text">{p.code}</span>
                      <button
                        type="button"
                        className="copy-code-btn"
                        onClick={() => handleCopy(p.code)}
                        title="Copy Code"
                      >
                        {copiedCode === p.code ? <CheckCircle size={13} color="#059669" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </td>

                  <td>
                    <span className="discount-rate-badge">{p.discountPercent}% OFF</span>
                  </td>

                  <td>
                    <span className="min-order-text">${p.minOrderAmount}</span>
                  </td>

                  <td>
                    <span className="max-cap-text">${p.maxDiscountAmount}</span>
                  </td>

                  <td>
                    <div className="capacity-bar-wrap">
                      <div className="capacity-labels">
                        <span>{p.usageCount} / {p.maxUses} used</span>
                        <strong>{percent}%</strong>
                      </div>
                      <div className="mini-progress-track">
                        <div
                          className="mini-progress-fill bg-emerald"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="expiry-date-text">{p.expiryDate}</span>
                  </td>

                  <td className="td-actions">
                    <button
                      type="button"
                      className="table-action-icon-btn delete"
                      onClick={() => setPromos(promos.filter((item) => item.id !== p.id))}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create Promo Modal */}
      {showAddModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Platform Promo Voucher</h3>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="modal-form-content">
              <div className="form-group">
                <label>Voucher Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH30"
                  value={newPromo.code}
                  onChange={(e) =>
                    setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })
                  }
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Discount Percentage (%) *</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    required
                    value={newPromo.discountPercent}
                    onChange={(e) =>
                      setNewPromo({ ...newPromo, discountPercent: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Min Order Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newPromo.minOrderAmount}
                    onChange={(e) =>
                      setNewPromo({ ...newPromo, minOrderAmount: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Max Discount Cap ($)</label>
                  <input
                    type="number"
                    min="1"
                    value={newPromo.maxDiscountAmount}
                    onChange={(e) =>
                      setNewPromo({ ...newPromo, maxDiscountAmount: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Max Total Redemptions</label>
                  <input
                    type="number"
                    min="10"
                    value={newPromo.maxUses}
                    onChange={(e) =>
                      setNewPromo({ ...newPromo, maxUses: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={newPromo.expiryDate}
                  onChange={(e) =>
                    setNewPromo({ ...newPromo, expiryDate: e.target.value })
                  }
                />
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn">
                  Publish Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromos;
