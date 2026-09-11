import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Bike,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  User,
  ExternalLink,
  ChevronRight,
  Eye,
  X
} from 'lucide-react';
import {
  getPlatformOrdersApi,
  updatePlatformOrderStatusApi,
  assignDeliveryDriverApi
} from '../../../apiService/api';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const availableDrivers = [
    { id: 4, name: 'Vikram Singh', phone: '+1 (555) 321-7890', zone: 'Downtown' },
    { id: 8, name: 'Alex Vance', phone: '+1 (555) 432-8901', zone: 'Midtown' },
    { id: 12, name: 'Carlos Mendez', phone: '+1 (555) 543-9012', zone: 'Chelsea' },
  ];

  const defaultOrders = [
    { id: 9842, customerName: "Rahul Sharma", customerEmail: "rahul@gmail.com", customerPhone: "+1 (555) 111-2222", restaurantName: "Artisan Truffle Pizza", restaurantId: 2, totalAmount: 48.50, status: "OUT_FOR_DELIVERY", paymentMethod: "STRIPE_CARD", paymentStatus: "PAID", deliveryAddress: "Apt 4B, 782 Broadway St, NY", orderDate: "2026-09-10T14:20:00", deliveryAgentName: "Vikram Singh", deliveryAgentId: 4, itemsCount: 3 },
    { id: 9841, customerName: "Sarah Jenkins", customerEmail: "sarah@gmail.com", customerPhone: "+1 (555) 333-4444", restaurantName: "The Olive Gardenia", restaurantId: 1, totalAmount: 72.00, status: "PREPARING", paymentMethod: "APPLE_PAY", paymentStatus: "PAID", deliveryAddress: "Suite 1200, 350 5th Ave, NY", orderDate: "2026-09-10T14:12:00", deliveryAgentName: "Unassigned", deliveryAgentId: null, itemsCount: 4 },
    { id: 9840, customerName: "David Copper", customerEmail: "david.c@yahoo.com", customerPhone: "+1 (555) 555-6666", restaurantName: "Kyoto Omakase", restaurantId: 3, totalAmount: 110.00, status: "DELIVERED", paymentMethod: "CREDIT_CARD", paymentStatus: "PAID", deliveryAddress: "12 Perry St, West Village, NY", orderDate: "2026-09-10T13:30:00", deliveryAgentName: "Alex Vance", deliveryAgentId: 8, itemsCount: 2 },
    { id: 9839, customerName: "Linda Gomez", customerEmail: "linda@outlook.com", customerPhone: "+1 (555) 777-8888", restaurantName: "Taco Libre Cantina", restaurantId: 4, totalAmount: 34.20, status: "CONFIRMED", paymentMethod: "CASH_ON_DELIVERY", paymentStatus: "PENDING", deliveryAddress: "220 Central Park South, NY", orderDate: "2026-09-10T14:25:00", deliveryAgentName: "Unassigned", deliveryAgentId: null, itemsCount: 2 },
    { id: 9838, customerName: "Kevin Durant", customerEmail: "kevin@kd.com", customerPhone: "+1 (555) 999-0000", restaurantName: "Artisan Truffle Pizza", restaurantId: 2, totalAmount: 55.00, status: "CANCELED", paymentMethod: "ONLINE", paymentStatus: "REFUNDED", deliveryAddress: "88 Bedford St, NY", orderDate: "2026-09-10T12:00:00", deliveryAgentName: null, deliveryAgentId: null, itemsCount: 2 }
  ];

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getPlatformOrdersApi();
    if (data && Array.isArray(data) && data.length > 0) {
      setOrders(data);
    } else {
      setOrders(defaultOrders);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    await updatePlatformOrderStatusApi(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleAssignDriver = async (orderId, driverId) => {
    const driver = availableDrivers.find((d) => d.id === Number(driverId));
    await assignDeliveryDriverApi(orderId, Number(driverId));
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              deliveryAgentId: driver?.id,
              deliveryAgentName: driver?.name,
              status: o.status === 'PREPARING' ? 'OUT_FOR_DELIVERY' : o.status
            }
          : o
      )
    );
  };

  const filteredOrders = (orders.length > 0 ? orders : defaultOrders).filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const cust = o.customerName || '';
    const res = o.restaurantName || '';
    const addr = o.deliveryAddress || '';
    const matchesSearch =
      String(o.id).includes(searchTerm) ||
      cust.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addr.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="admin-orders-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-pre-title">GLOBAL DISPATCH & TELEMETRY</div>
          <h1 className="admin-main-heading">Order Flow & Fleet Oversight</h1>
          <p className="admin-sub-heading">
            Live command and control for customer orders, restaurant kitchen queues, and courier assignments.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="admin-filter-toolbar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Order ID, customer, restaurant, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-filter-pills">
          {[
            { id: 'ALL', label: 'All Orders' },
            { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
            { id: 'PREPARING', label: 'Kitchen Preparing' },
            { id: 'CONFIRMED', label: 'Confirmed' },
            { id: 'DELIVERED', label: 'Delivered' },
            { id: 'CANCELED', label: 'Canceled' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`filter-pill ${statusFilter === tab.id ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-table-container">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer & Contact</th>
              <th>Restaurant Source</th>
              <th>Total & Items</th>
              <th>Status</th>
              <th>Assigned Courier</th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-table-cell">
                  No orders found matching the selected filters.
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <span className="order-id-chip">#{ord.id}</span>
                  </td>

                  <td>
                    <div className="order-customer-stack">
                      <span className="cust-name-val">{ord.customerName}</span>
                      <span className="cust-addr-val">
                        <MapPin size={11} /> {ord.deliveryAddress}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className="restaurant-tag-text">{ord.restaurantName}</span>
                  </td>

                  <td>
                    <div className="order-amount-stack">
                      <span className="ord-amount-val">${ord.totalAmount?.toFixed(2)}</span>
                      <span className="ord-items-val">{ord.itemsCount} dishes</span>
                    </div>
                  </td>

                  <td>
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                      className={`order-status-badge badge-${ord.status?.toLowerCase()}`}
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PREPARING">PREPARING</option>
                      <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELED">CANCELED</option>
                    </select>
                  </td>

                  <td>
                    <select
                      value={ord.deliveryAgentId || ''}
                      onChange={(e) => handleAssignDriver(ord.id, e.target.value)}
                      className="driver-assign-select"
                    >
                      <option value="">-- Assign Driver --</option>
                      {availableDrivers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.zone})
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="td-actions">
                    <button
                      type="button"
                      className="view-order-btn"
                      onClick={() => setSelectedOrder(ord)}
                      title="View Details"
                    >
                      <Eye size={15} />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal-box order-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Order #{selectedOrder.id} Details</h3>
                <span className="modal-sub">Placed on {new Date(selectedOrder.orderDate).toLocaleString()}</span>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="order-drawer-body">
              <div className="drawer-section">
                <h4>Customer Information</h4>
                <div className="info-grid-2">
                  <div><strong>Name:</strong> {selectedOrder.customerName}</div>
                  <div><strong>Phone:</strong> {selectedOrder.customerPhone || 'N/A'}</div>
                  <div><strong>Email:</strong> {selectedOrder.customerEmail}</div>
                  <div><strong>Payment:</strong> {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</div>
                </div>
                <div className="address-box">
                  <strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}
                </div>
              </div>

              <div className="drawer-section">
                <h4>Restaurant & Fulfilment</h4>
                <div className="info-grid-2">
                  <div><strong>Restaurant:</strong> {selectedOrder.restaurantName}</div>
                  <div><strong>Status:</strong> {selectedOrder.status}</div>
                  <div><strong>Courier:</strong> {selectedOrder.deliveryAgentName || 'Unassigned'}</div>
                  <div><strong>Total Amount:</strong> ${selectedOrder.totalAmount?.toFixed(2)}</div>
                </div>
              </div>

              <div className="drawer-section">
                <h4>Override Order Status</h4>
                <div className="status-quick-pills">
                  {['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`quick-pill ${selectedOrder.status === st ? 'active' : ''}`}
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-actions-footer">
              <button
                type="button"
                className="modal-submit-btn"
                onClick={() => setSelectedOrder(null)}
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
