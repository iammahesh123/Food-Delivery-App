import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Building2,
  Users,
  Bike,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  CalendarCheck,
  Ticket,
  ChevronRight
} from 'lucide-react';
import { getPlatformStatsApi } from '../../../apiService/api';
import './AdminOverview.css';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('6M'); // '7D' | '30D' | '6M'

  const fetchStats = async () => {
    setIsRefreshing(true);
    const data = await getPlatformStatsApi();
    setStats(data);
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading-state">
        <RefreshCw className="spinner" size={28} />
        <span>Loading Platform Executive Analytics...</span>
      </div>
    );
  }

  return (
    <div className="admin-overview-page">
      {/* Top Header Banner */}
      <div className="overview-header-row">
        <div>
          <div className="overview-badge">
            <Sparkles size={13} />
            <span>EXECUTIVE COMMAND CENTER</span>
          </div>
          <h1 className="overview-title">Platform Performance & Oversight</h1>
          <p className="overview-sub">
            Real-time telemetry across restaurants, delivery fleets, dining bookings, and customer transactions.
          </p>
        </div>

        <div className="overview-actions-wrap">
          <div className="time-filter-group">
            {['7D', '30D', '6M', '1Y'].map((t) => (
              <button
                key={t}
                type="button"
                className={`time-btn ${timeRange === t ? 'active' : ''}`}
                onClick={() => setTimeRange(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="refresh-metrics-btn"
            onClick={fetchStats}
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={isRefreshing ? 'spinner' : ''} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Live'}</span>
          </button>
        </div>
      </div>

      {/* 6 Primary KPI Stat Cards */}
      <div className="kpi-cards-grid">
        <div className="kpi-card accent-orange">
          <div className="kpi-top">
            <span className="kpi-label">GROSS MERCHANDISE VALUE</span>
            <div className="kpi-icon-box bg-orange">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="kpi-value">${stats.totalGmv?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="kpi-trend positive">
            <ArrowUpRight size={14} />
            <span>+18.4%</span>
            <span className="trend-period">vs last period</span>
          </div>
        </div>

        <div className="kpi-card accent-emerald">
          <div className="kpi-top">
            <span className="kpi-label">NET PLATFORM REVENUE</span>
            <div className="kpi-icon-box bg-emerald">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="kpi-value">${stats.platformRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="kpi-trend positive">
            <ArrowUpRight size={14} />
            <span>15.0% take rate</span>
            <span className="trend-period">commission</span>
          </div>
        </div>

        <div className="kpi-card accent-blue">
          <div className="kpi-top">
            <span className="kpi-label">TOTAL PLATFORM ORDERS</span>
            <div className="kpi-icon-box bg-blue">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="kpi-value">{stats.totalOrders?.toLocaleString()}</div>
          <div className="kpi-trend positive">
            <ArrowUpRight size={14} />
            <span>+12.8%</span>
            <span className="trend-period">order volume</span>
          </div>
        </div>

        <div className="kpi-card accent-purple">
          <div className="kpi-top">
            <span className="kpi-label">ACTIVE RESTAURANTS</span>
            <div className="kpi-icon-box bg-purple">
              <Building2 size={20} />
            </div>
          </div>
          <div className="kpi-value">{stats.activeRestaurants}</div>
          <div className="kpi-subtext">Across 8 city zones</div>
        </div>

        <div className="kpi-card accent-cyan">
          <div className="kpi-top">
            <span className="kpi-label">REGISTERED USERS</span>
            <div className="kpi-icon-box bg-cyan">
              <Users size={20} />
            </div>
          </div>
          <div className="kpi-value">{stats.totalUsers?.toLocaleString()}</div>
          <div className="kpi-trend positive">
            <ArrowUpRight size={14} />
            <span>+84 this week</span>
          </div>
        </div>

        <div className="kpi-card accent-amber">
          <div className="kpi-top">
            <span className="kpi-label">ACTIVE COURIER FLEET</span>
            <div className="kpi-icon-box bg-amber">
              <Bike size={20} />
            </div>
          </div>
          <div className="kpi-value">{stats.activeDeliveryAgents}</div>
          <div className="kpi-subtext">Avg delivery: 24 mins</div>
        </div>
      </div>

      {/* Main Analytics Grid: Revenue Chart + Order Distribution */}
      <div className="analytics-split-grid">
        {/* Monthly GMV & Revenue Chart */}
        <div className="analytics-card chart-card">
          <div className="card-header-bar">
            <div>
              <h3 className="card-heading">Platform Revenue & GMV Trajectory</h3>
              <p className="card-caption">Monthly gross transaction value & net commissions</p>
            </div>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot gmv-dot"></span> GMV ($)</span>
              <span className="legend-item"><span className="dot rev-dot"></span> Platform Revenue ($)</span>
            </div>
          </div>

          <div className="bar-chart-container">
            {stats.monthlyRevenue?.map((m, idx) => {
              const maxGmv = 45000;
              const gmvPercent = Math.min(100, Math.round((m.gmv / maxGmv) * 100));
              const revPercent = Math.min(100, Math.round(((m.revenue * 5) / maxGmv) * 100));

              return (
                <div key={idx} className="chart-bar-group">
                  <div className="bar-towers">
                    <div
                      className="bar-tower gmv-tower"
                      style={{ height: `${gmvPercent}%` }}
                      title={`GMV: $${m.gmv.toLocaleString()}`}
                    >
                      <span className="tower-value">${(m.gmv / 1000).toFixed(0)}k</span>
                    </div>
                    <div
                      className="bar-tower rev-tower"
                      style={{ height: `${revPercent}%` }}
                      title={`Revenue: $${m.revenue.toLocaleString()}`}
                    />
                  </div>
                  <span className="chart-month-label">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orders Status Distribution */}
        <div className="analytics-card distribution-card">
          <div className="card-header-bar">
            <div>
              <h3 className="card-heading">Live Order Status Flow</h3>
              <p className="card-caption">Active distribution across delivery pipeline</p>
            </div>
          </div>

          <div className="status-flow-list">
            <div className="status-flow-item">
              <div className="status-info">
                <span className="status-dot dot-out"></span>
                <span className="status-name">Out for Delivery</span>
              </div>
              <div className="status-metric">
                <strong className="count">{stats.ordersByStatus?.OUT_FOR_DELIVERY || 38}</strong>
                <div className="mini-progress-track">
                  <div className="mini-progress-fill bg-emerald" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>

            <div className="status-flow-item">
              <div className="status-info">
                <span className="status-dot dot-preparing"></span>
                <span className="status-name">Kitchen Preparing</span>
              </div>
              <div className="status-metric">
                <strong className="count">{stats.ordersByStatus?.PREPARING || 29}</strong>
                <div className="mini-progress-track">
                  <div className="mini-progress-fill bg-orange" style={{ width: '48%' }}></div>
                </div>
              </div>
            </div>

            <div className="status-flow-item">
              <div className="status-info">
                <span className="status-dot dot-confirmed"></span>
                <span className="status-name">Confirmed & Queued</span>
              </div>
              <div className="status-metric">
                <strong className="count">{stats.ordersByStatus?.CONFIRMED || 42}</strong>
                <div className="mini-progress-track">
                  <div className="mini-progress-fill bg-blue" style={{ width: '55%' }}></div>
                </div>
              </div>
            </div>

            <div className="status-flow-item">
              <div className="status-info">
                <span className="status-dot dot-delivered"></span>
                <span className="status-name">Successfully Delivered</span>
              </div>
              <div className="status-metric">
                <strong className="count">{stats.ordersByStatus?.DELIVERED || 3180}</strong>
                <div className="mini-progress-track">
                  <div className="mini-progress-fill bg-purple" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats Row */}
          <div className="secondary-stats-strip">
            <div className="sec-stat-box">
              <CalendarCheck size={18} className="sec-icon text-orange" />
              <div>
                <div className="sec-val">{stats.totalDiningBookings}</div>
                <div className="sec-lbl">Dining Reservations</div>
              </div>
            </div>
            <div className="sec-stat-box">
              <Ticket size={18} className="sec-icon text-cyan" />
              <div>
                <div className="sec-val">{stats.totalEventTickets}</div>
                <div className="sec-lbl">Event Tickets</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Live Platform Activity Stream + Top Leaderboard */}
      <div className="bottom-overview-grid">
        {/* Live Activity Stream */}
        <div className="analytics-card activity-stream-card">
          <div className="card-header-bar">
            <div>
              <h3 className="card-heading">Live Platform Activity Pulse</h3>
              <p className="card-caption">Real-time transactions, onboarding, and customer events</p>
            </div>
            <span className="pulse-tag">Live Stream</span>
          </div>

          <div className="activity-items-list">
            {stats.recentActivity?.map((act) => (
              <div key={act.id} className="activity-item-row">
                <div className={`activity-type-badge ${act.type.toLowerCase()}`}>
                  {act.type}
                </div>
                <div className="activity-content">
                  <div className="activity-title-row">
                    <span className="act-title">{act.title}</span>
                    <span className="act-time">{act.timestamp}</span>
                  </div>
                  <div className="act-desc">{act.description}</div>
                </div>
                {act.amount !== null && (
                  <div className="activity-amount">
                    ${act.amount?.toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Restaurant Partners Leaderboard */}
        <div className="analytics-card leaderboard-card">
          <div className="card-header-bar">
            <div>
              <h3 className="card-heading">Top Performing Merchants</h3>
              <p className="card-caption">Ranked by customer rating and monthly GMV</p>
            </div>
          </div>

          <div className="merchants-leaderboard-list">
            {[
              { rank: 1, name: "Artisan Truffle Pizza & Grill", gmv: "$42,100", orders: 890, rating: 4.9, zone: "Downtown" },
              { rank: 2, name: "Kyoto Omakase & Robata", gmv: "$34,500", orders: 310, rating: 4.8, zone: "Uptown" },
              { rank: 3, name: "The Olive Gardenia", gmv: "$28,450", orders: 642, rating: 4.8, zone: "Midtown" },
              { rank: 4, name: "Taco Libre Cantina", gmv: "$15,800", orders: 420, rating: 4.5, zone: "Chelsea" },
              { rank: 5, name: "Golden Dragon Dumpling House", gmv: "$8,900", orders: 180, rating: 4.2, zone: "Chinatown" },
            ].map((m) => (
              <div key={m.rank} className="leaderboard-item">
                <span className={`rank-badge rank-${m.rank}`}>#{m.rank}</span>
                <div className="merchant-info">
                  <span className="merchant-name">{m.name}</span>
                  <span className="merchant-meta">{m.zone} • {m.orders} orders • ⭐ {m.rating}</span>
                </div>
                <div className="merchant-gmv">{m.gmv}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
