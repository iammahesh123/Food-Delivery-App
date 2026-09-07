import React, { useContext, useState } from 'react';
import { StoreContext } from '../../../context/StoreContext';
import {
  Clock,
  Printer,
  CheckCircle2,
  ChefHat,
  Bike,
  PackageCheck,
  AlertCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Toast from '../../ui/Toast';
import './LiveOrders.css';

const COLUMNS = [
  { key: 'CONFIRMED', title: 'Incoming / New Orders', color: 'confirmed' },
  { key: 'PREPARING', title: 'Kitchen Preparing', color: 'preparing' },
  { key: 'READY_FOR_PICKUP', title: 'Ready for Pickup', color: 'delivery' },
  { key: 'OUT_FOR_DELIVERY', title: 'Out for Delivery', color: 'primary' },
];

const LiveOrders = () => {
  const { orders, updateOrderStatus } = useContext(StoreContext);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    setToastMessage({
      text: `Order #${orderId} moved to ${newStatus.replace(/_/g, ' ')}.`,
      type: 'success',
    });
  };

  const handlePrintKOT = (order) => {
    alert(`[KITCHEN TICKET (KOT) PRINTED]\nOrder: ${order.id}\nItems:\n${order.items.map((i) => ` - ${i.quantity}x ${i.name}`).join('\n')}`);
  };

  return (
    <div className="live-orders-page fade-in">
      {toastMessage && (
        <Toast
          message={toastMessage.text}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Board Header */}
      <div className="live-orders-toolbar">
        <div>
          <h1 className="board-title">Live Kitchen & Order Dispatch Board</h1>
          <p className="board-desc">
            Real-time status management for restaurant order fulfillment and kitchen stations.
          </p>
        </div>

        <div className="board-actions">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            Sound Alerts: {soundEnabled ? 'ON' : 'OFF'}
          </Button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="kanban-grid">
        {COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.key);

          return (
            <div key={col.key} className="kanban-column">
              <div className="column-header">
                <h3 className="column-title">{col.title}</h3>
                <span className="column-count-badge">{colOrders.length}</span>
              </div>

              <div className="column-cards-stream">
                {colOrders.length === 0 ? (
                  <div className="column-empty">
                    <span>No active tickets</span>
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const elapsedMinutes = Math.floor(
                      (Date.now() - new Date(order.timestamp).getTime()) / 60000
                    );

                    return (
                      <div key={order.id} className="ticket-card">
                        <div className="ticket-top">
                          <span className="ticket-id">{order.id}</span>
                          <span className="ticket-timer">
                            <Clock size={12} /> {elapsedMinutes}m ago
                          </span>
                        </div>

                        <div className="ticket-customer">
                          <strong>{order.customerName}</strong>
                          <span className="customer-phone">{order.customerPhone}</span>
                        </div>

                        <div className="ticket-items">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="ticket-item-row">
                              <span className="qty">{it.quantity}x</span>
                              <span className="name">{it.name}</span>
                            </div>
                          ))}
                        </div>

                        {order.deliveryInstructions && (
                          <div className="ticket-note">
                            <strong>Note:</strong> {order.deliveryInstructions}
                          </div>
                        )}

                        <div className="ticket-actions">
                          <button
                            type="button"
                            className="kot-print-btn"
                            title="Print Kitchen Ticket"
                            onClick={() => handlePrintKOT(order)}
                          >
                            <Printer size={14} /> KOT
                          </button>

                          {col.key === 'CONFIRMED' && (
                            <Button
                              size="sm"
                              variant="primary"
                              leftIcon={<ChefHat size={14} />}
                              onClick={() => handleStatusChange(order.id, 'PREPARING')}
                            >
                              Start Prep
                            </Button>
                          )}

                          {col.key === 'PREPARING' && (
                            <Button
                              size="sm"
                              variant="primary"
                              leftIcon={<CheckCircle2 size={14} />}
                              onClick={() => handleStatusChange(order.id, 'READY_FOR_PICKUP')}
                            >
                              Ready
                            </Button>
                          )}

                          {col.key === 'READY_FOR_PICKUP' && (
                            <Button
                              size="sm"
                              variant="primary"
                              leftIcon={<Bike size={14} />}
                              onClick={() => handleStatusChange(order.id, 'OUT_FOR_DELIVERY')}
                            >
                              Dispatch
                            </Button>
                          )}

                          {col.key === 'OUT_FOR_DELIVERY' && (
                            <Button
                              size="sm"
                              variant="secondary"
                              leftIcon={<PackageCheck size={14} />}
                              onClick={() => handleStatusChange(order.id, 'DELIVERED')}
                            >
                              Delivered
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveOrders;
