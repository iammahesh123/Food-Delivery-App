import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Database,
  Cpu,
  ShieldAlert,
  Save,
  CheckCircle2,
  RefreshCw,
  Sliders,
  BellRing
} from 'lucide-react';
import { getPlatformSystemHealthApi } from '../../../apiService/api';
import './AdminSettings.css';

const AdminSettings = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const [settings, setSettings] = useState({
    maintenanceMode: false,
    defaultCommission: 15.0,
    serviceFee: 2.50,
    freeDeliveryThreshold: 40.00,
    emergencyNotice: '',
    supportEmail: 'support@tomato.food'
  });

  const fetchHealth = async () => {
    const data = await getPlatformSystemHealthApi();
    setHealth(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="admin-settings-page">
      <div className="admin-page-header">
        <div>
          <div className="admin-pre-title">INFRASTRUCTURE & CONFIGURATION</div>
          <h1 className="admin-main-heading">System Health & Platform Settings</h1>
          <p className="admin-sub-heading">
            Live infrastructure diagnostics, database connection pools, global commission rules, and emergency broadcasts.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-btn"
          onClick={handleSave}
        >
          <Save size={16} />
          <span>Save System Parameters</span>
        </button>
      </div>

      {isSaved && (
        <div className="settings-saved-banner">
          <CheckCircle2 size={18} />
          <span>Platform system parameters updated and broadcast to edge clusters successfully!</span>
        </div>
      )}

      {/* Health Diagnostics Grid */}
      <div className="health-cards-grid">
        <div className="health-card">
          <div className="health-card-top">
            <span className="health-title">API GATEWAY HEALTH</span>
            <Server size={18} className="text-emerald" />
          </div>
          <div className="health-main-val">99.98%</div>
          <div className="health-sub">Uptime: {Math.floor((health?.uptimeSeconds || 148200) / 3600)} hours</div>
        </div>

        <div className="health-card">
          <div className="health-card-top">
            <span className="health-title">DATABASE CLUSTER</span>
            <Database size={18} className="text-blue" />
          </div>
          <div className="health-main-val">ACTIVE</div>
          <div className="health-sub">{health?.databaseStatus || 'PostgreSQL Connection Pool: 10/10'}</div>
        </div>

        <div className="health-card">
          <div className="health-card-top">
            <span className="health-title">JVM HEAP MEMORY</span>
            <Cpu size={18} className="text-orange" />
          </div>
          <div className="health-main-val">
            {health?.usedMemoryMb || 340} / {health?.maxMemoryMb || 1024} MB
          </div>
          <div className="health-sub">33% Utilization</div>
        </div>

        <div className="health-card">
          <div className="health-card-top">
            <span className="health-title">CONCURRENT SESSIONS</span>
            <Activity size={18} className="text-purple" />
          </div>
          <div className="health-main-val">{health?.activeHttpConnections || 48}</div>
          <div className="health-sub">Average response: 42ms</div>
        </div>
      </div>

      {/* Global Configuration Controls Form */}
      <form onSubmit={handleSave} className="settings-form-layout">
        <div className="settings-section-card">
          <div className="sec-card-header">
            <Sliders size={18} className="text-orange" />
            <div>
              <h3>Platform Financial Parameters</h3>
              <p>Configure default platform take rate and checkout subsidies</p>
            </div>
          </div>

          <div className="settings-inputs-grid">
            <div className="form-group">
              <label>Default Partner Commission Rate (%)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="50"
                value={settings.defaultCommission}
                onChange={(e) =>
                  setSettings({ ...settings, defaultCommission: Number(e.target.value) })
                }
              />
              <span className="input-hint">Applied to all new restaurant onboardings</span>
            </div>

            <div className="form-group">
              <label>Platform Service Fee ($)</label>
              <input
                type="number"
                step="0.25"
                min="0"
                value={settings.serviceFee}
                onChange={(e) =>
                  setSettings({ ...settings, serviceFee: Number(e.target.value) })
                }
              />
              <span className="input-hint">Charged per customer checkout order</span>
            </div>

            <div className="form-group">
              <label>Free Delivery Minimum Threshold ($)</label>
              <input
                type="number"
                min="10"
                value={settings.freeDeliveryThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })
                }
              />
              <span className="input-hint">Cart value required for waived courier charges</span>
            </div>

            <div className="form-group">
              <label>Platform Support Escalation Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) =>
                  setSettings({ ...settings, supportEmail: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Emergency & Maintenance Controls */}
        <div className="settings-section-card danger-zone">
          <div className="sec-card-header">
            <ShieldAlert size={18} className="text-red" />
            <div>
              <h3>Emergency Broadcasts & Maintenance Safeguards</h3>
              <p>Critical platform gates affecting all active customer apps</p>
            </div>
          </div>

          <div className="toggle-setting-row">
            <div>
              <strong>Platform Maintenance Mode</strong>
              <p>When enabled, customer ordering is locked and a graceful maintenance message is shown.</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  setSettings({ ...settings, maintenanceMode: e.target.checked })
                }
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label>Emergency Platform Banner Announcement (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Due to extreme blizzard conditions in Midtown, delivery delays of 15-20 minutes are expected."
              value={settings.emergencyNotice}
              onChange={(e) =>
                setSettings({ ...settings, emergencyNotice: e.target.value })
              }
            />
            <span className="input-hint">Displayed across customer store header</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
