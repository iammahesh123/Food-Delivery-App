import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { Clock, ArrowRight, RotateCcw, Package, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import './MyOrders.css';

const MyOrders = () => {
  const { orders, addToCart } = useContext(StoreContext);
  const navigate = useNavigate();
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'COMPLETED'

  const filteredOrders = orders.filter((order) => {
    if (filterTab === 'ACTIVE') {
      return order.status !== 'DELIVERED' && order.status !== 'CANCELED';
    }
    if (filterTab === 'COMPLETED') {
      return order.status === 'DELIVERED' || order.status === 'CANCELED';
    }
    return true;
  });

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addToCart(item.id);
      }
    });
    navigate('/cart');
  };

  return (
    <div className="my-orders-page fade-in">
      <div className="my-orders-header">
        <div>
          <h1 className="my-orders-title">My Order History</h1>
          <p className="my-orders-subtitle">
            Track past meals, view receipts, and re-order your favorite culinary dishes.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="order-tabs-control" role="tablist">
          <button
            type="button"
            className={`tab-btn ${filterTab === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterTab('ALL')}
            role="tab"
            aria-selected={filterTab === 'ALL'}
          >
            All Orders ({orders.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${filterTab === 'ACTIVE' ? 'active' : ''}`}
            onClick={() => setFilterTab('ACTIVE')}
            role="tab"
            aria-selected={filterTab === 'ACTIVE'}
          >
            Active
          </button>
          <button
            type="button"
            className={`tab-btn ${filterTab === 'COMPLETED' ? 'active' : ''}`}
            onClick={() => setFilterTab('COMPLETED')}
            role="tab"
            aria-selected={filterTab === 'COMPLETED'}
          >
            Completed
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="orders-empty-state">
          <Package size={48} className="empty-icon" />
          <h3>No orders found</h3>
          <p>You have not placed any orders under this filter.</p>
          <Button variant="primary" onClick={() => navigate('/explore-menu')}>
            Browse Menu Catalog
          </Button>
        </div>
      ) : (
        <div className="orders-cards-list">
          {filteredOrders.map((order) => {
            const isActive = order.status !== 'DELIVERED' && order.status !== 'CANCELED';
            const orderDate = new Date(order.timestamp).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div key={order.id} className="order-history-card">
                <div className="card-top-row">
                  <div className="restaurant-meta">
                    <h3 className="restaurant-name">{order.restaurantName}</h3>
                    <span className="order-date">Placed on {orderDate}</span>
                  </div>
                  <div className="status-badge-wrap">
                    <Badge variant={order.status.toLowerCase()} size="md">
                      ● {order.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>

                <div className="card-items-preview">
                  <div className="items-names">
                    {order.items.map((it, idx) => (
                      <span key={idx} className="item-token">
                        {it.quantity}x {it.name}
                        {idx < order.items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                  <span className="order-total-price">${order.totalAmount.toFixed(2)}</span>
                </div>

                <div className="card-bottom-row">
                  <span className="order-id-tag">ID: {order.id}</span>

                  <div className="order-actions">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<RotateCcw size={14} />}
                      onClick={() => handleReorder(order)}
                    >
                      Reorder
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      rightIcon={<ArrowRight size={14} />}
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      {isActive ? 'Track Live' : 'View Receipt'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
