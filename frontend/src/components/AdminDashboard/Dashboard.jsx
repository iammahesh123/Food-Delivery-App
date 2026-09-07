import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Bike,
  ArrowUpRight,
  ChefHat,
  Users,
  CalendarCheck,
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import './Dashboard.css';

const Dashboard = () => {
  const { orders, food_list, tableBookings } = useContext(StoreContext);
  const navigate = useNavigate();

  // Metrics computation
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'CONFIRMED' || o.status === 'PREPARING' || o.status === 'READY_FOR_PICKUP' || o.status === 'OUT_FOR_DELIVERY'
  ).length;

  const kpis = [
    {
      title: "Today's Gross Sales",
      value: `$${totalRevenue.toFixed(2)}`,
      trend: '+18.4% vs last week',
      icon: DollarSign,
      color: 'emerald',
    },
    {
      title: 'Active Orders In Flight',
      value: activeOrdersCount,
      trend: '4 requiring kitchen attention',
      icon: ShoppingBag,
      color: 'primary',
    },
    {
      title: 'Avg Kitchen SLA',
      value: '18 mins',
      trend: '-2.5m faster prep',
      icon: Clock,
      color: 'amber',
    },
    {
      title: 'Table Reservations',
      value: tableBookings.length || 6,
      trend: 'Lunch & Dinner booked',
      icon: CalendarCheck,
      color: 'indigo',
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="dashboard-overview-page fade-in">
      {/* Executive Welcome & Actions */}
      <div className="dashboard-welcome-banner">
        <div>
          <h1 className="welcome-title">Merchant Operations Control Center</h1>
          <p className="welcome-subtitle">
            Live overview of kitchen ticket volume, daily settlement revenue, and delivery fulfillment.
          </p>
        </div>

        <div className="welcome-actions">
          <Button
            variant="secondary"
            onClick={() => navigate('/dashboard/menu')}
          >
            Menu Catalog ({food_list.length})
          </Button>
          <Button
            variant="primary"
            leftIcon={<ChefHat size={16} />}
            onClick={() => navigate('/dashboard/live-orders')}
          >
            Open Live Kitchen Board
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-cards-grid">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="kpi-card">
              <div className="kpi-top">
                <span className="kpi-title">{kpi.title}</span>
                <div className={`kpi-icon-wrap ${kpi.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="kpi-value">{kpi.value}</div>
              <span className="kpi-trend">
                <ArrowUpRight size={14} /> {kpi.trend}
              </span>
            </div>
          );
        })}
      </div>

      {/* Two Column Operational Dashboard Grid */}
      <div className="dashboard-grid-content">
        {/* Left Column: Recent Orders Ledger */}
        <div className="dashboard-card recent-orders-card">
          <div className="card-top-header">
            <h2>Recent Incoming Orders</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/live-orders')}
            >
              View Full Queue →
            </Button>
          </div>

          <div className="recent-orders-list">
            {recentOrders.map((order) => (
              <div key={order.id} className="recent-order-item">
                <div className="order-left">
                  <div className="order-id-badge">#{order.id}</div>
                  <div className="order-meta">
                    <strong>{order.customerName}</strong>
                    <span>
                      {order.items.length} dishes • {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="order-right">
                  <span className="order-amount">${order.totalAmount.toFixed(2)}</span>
                  <Badge variant={order.status.toLowerCase()}>
                    {order.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Kitchen Prep Capacity & Table Status */}
        <div className="dashboard-card kitchen-health-card">
          <div className="card-top-header">
            <h2>Kitchen Capacity & Operations SLA</h2>
          </div>

          <div className="station-meters-list">
            <div className="station-meter-item">
              <div className="meter-label-row">
                <span>Pizza Oven Station</span>
                <strong>75% Load (4 orders active)</strong>
              </div>
              <div className="meter-track">
                <div className="meter-fill" style={{ width: '75%', backgroundColor: '#f59e0b' }} />
              </div>
            </div>

            <div className="station-meter-item">
              <div className="meter-label-row">
                <span>Pasta & Sauté Station</span>
                <strong>40% Load (2 orders active)</strong>
              </div>
              <div className="meter-track">
                <div className="meter-fill" style={{ width: '40%', backgroundColor: '#10b981' }} />
              </div>
            </div>

            <div className="station-meter-item">
              <div className="meter-label-row">
                <span>Salad & Cold Prep Station</span>
                <strong>20% Load (1 order active)</strong>
              </div>
              <div className="meter-track">
                <div className="meter-fill" style={{ width: '20%', backgroundColor: '#3b82f6' }} />
              </div>
            </div>
          </div>

          <div className="merchant-contact-box">
            <h4>Store Operations Status</h4>
            <p>Fulfilling orders normally. All couriers dispatched within 4 minutes of ready signal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;