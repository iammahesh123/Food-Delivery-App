import React, { useState, useEffect } from 'react';
import { Timer, CloudRain, Navigation, Flame, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';
import { aiService } from '../../apiService/aiService';

const EtaPredictorScreen = () => {
  const [itemCount, setItemCount] = useState(3);
  const [complexity, setComplexity] = useState(3);
  const [queueCount, setQueueCount] = useState(6);
  const [distanceKm, setDistanceKm] = useState(4.2);
  const [weather, setWeather] = useState('CLEAR');
  const [traffic, setTraffic] = useState('MODERATE');
  const [loading, setLoading] = useState(false);
  const [etaResult, setEtaResult] = useState(null);

  const calculateEta = async () => {
    setLoading(true);
    try {
      const data = await aiService.predictEta({
        order_item_count: parseInt(itemCount, 10),
        dish_complexity_score: parseInt(complexity, 10),
        kitchen_current_queue: parseInt(queueCount, 10),
        distance_km: parseFloat(distanceKm),
        weather_condition: weather,
        traffic_level: traffic,
      });
      setEtaResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateEta();
  }, [itemCount, complexity, queueCount, distanceKm, weather, traffic]);

  return (
    <div className="ai-screen-container">
      {/* Simulation Controls */}
      <div className="ai-glass-card">
        <div className="ai-screen-header">
          <div>
            <h2 className="ai-screen-title">
              <Timer size={24} color="#ff4e50" />
              Dynamic Kitchen Prep & Logistics ETA Engine
            </h2>
            <p className="ai-screen-subtitle">
              Predictive neural regression: factors in live kitchen queue backlog, culinary dish complexity, weather disruption, and courier transit friction.
            </p>
          </div>
          <span className="ai-badge success">Live Simulator</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {/* Order Items Count Slider */}
          <div className="ai-slider-wrapper">
            <div className="ai-slider-header">
              <span>Order Size</span>
              <span style={{ fontWeight: '700', color: '#ffffff' }}>{itemCount} Dish(es)</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              className="ai-slider"
              value={itemCount}
              onChange={(e) => setItemCount(e.target.value)}
            />
          </div>

          {/* Dish Complexity Slider */}
          <div className="ai-slider-wrapper">
            <div className="ai-slider-header">
              <span>Dish Culinary Complexity</span>
              <span style={{ fontWeight: '700', color: '#f9d423' }}>Level {complexity} / 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              className="ai-slider"
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
            />
          </div>

          {/* Kitchen Queue Slider */}
          <div className="ai-slider-wrapper">
            <div className="ai-slider-header">
              <span>Kitchen Backlog Ahead</span>
              <span style={{ fontWeight: '700', color: queueCount >= 8 ? '#ff7675' : '#00b894' }}>
                {queueCount} active orders
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              className="ai-slider"
              value={queueCount}
              onChange={(e) => setQueueCount(e.target.value)}
            />
          </div>

          {/* Distance Slider */}
          <div className="ai-slider-wrapper">
            <div className="ai-slider-header">
              <span>Delivery Radius</span>
              <span style={{ fontWeight: '700', color: '#ffffff' }}>{distanceKm} km</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="12"
              step="0.5"
              className="ai-slider"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
            />
          </div>

          {/* Weather Condition */}
          <div>
            <label style={{ fontSize: '0.84rem', color: 'var(--ai-text-muted)', marginBottom: '6px', display: 'block' }}>
              Weather Factor
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['CLEAR', 'RAIN', 'STORM'].map((w) => (
                <button
                  key={w}
                  type="button"
                  className={weather === w ? 'ai-btn-primary' : 'ai-btn-secondary'}
                  style={{ flex: 1, padding: '8px 0', fontSize: '0.8rem', justifyContent: 'center' }}
                  onClick={() => setWeather(w)}
                >
                  {w === 'CLEAR' ? '☀️ Clear' : w === 'RAIN' ? '🌧️ Rain' : '⛈️ Storm'}
                </button>
              ))}
            </div>
          </div>

          {/* Traffic Density */}
          <div>
            <label style={{ fontSize: '0.84rem', color: 'var(--ai-text-muted)', marginBottom: '6px', display: 'block' }}>
              Traffic Density
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['LOW', 'MODERATE', 'HEAVY'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={traffic === t ? 'ai-btn-primary' : 'ai-btn-secondary'}
                  style={{ flex: 1, padding: '8px 0', fontSize: '0.8rem', justifyContent: 'center' }}
                  onClick={() => setTraffic(t)}
                >
                  {t === 'LOW' ? '🟢 Low' : t === 'MODERATE' ? '🟡 Moderate' : '🔴 Heavy'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Output Display */}
      {etaResult && (
        <div className="ai-glass-card">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            {/* Big Countdown Badge */}
            <div style={{ background: 'rgba(255, 78, 80, 0.08)', border: '1px solid rgba(255, 78, 80, 0.25)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.86rem', color: 'var(--ai-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
                Predicted Arrival Countdown
              </div>
              <div style={{ fontSize: '3.6rem', fontWeight: '900', color: '#ff4e50', lineHeight: '1.1', margin: '8px 0' }}>
                {etaResult.predicted_eta_minutes}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#f9d423' }}>Minutes</div>
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '6px' }}>
                95% Confidence Interval: {etaResult.confidence_interval.min_eta_minutes} - {etaResult.confidence_interval.max_eta_minutes} mins
              </div>
            </div>

            {/* Granular Factors Breakdown */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '14px' }}>
                AI Latency Decomposition
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Kitchen Base Prep */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ color: '#ffffff' }}>Fresh Kitchen Prep & Cooking</span>
                    <span style={{ color: '#f9d423', fontWeight: '700' }}>{etaResult.factors_breakdown.base_prep_minutes} mins</span>
                  </div>
                  <div className="ai-progress-bar">
                    <div className="ai-progress-fill" style={{ width: `${Math.min(100, (etaResult.factors_breakdown.base_prep_minutes / etaResult.predicted_eta_minutes) * 100)}%` }} />
                  </div>
                </div>

                {/* Queue Surge */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ color: '#ffffff' }}>Kitchen Queue Delay ({queueCount} orders ahead)</span>
                    <span style={{ color: '#ff7675', fontWeight: '700' }}>{etaResult.factors_breakdown.queue_surge_delay_minutes} mins</span>
                  </div>
                  <div className="ai-progress-bar">
                    <div className="ai-progress-fill" style={{ width: `${Math.min(100, (etaResult.factors_breakdown.queue_surge_delay_minutes / etaResult.predicted_eta_minutes) * 100)}%` }} />
                  </div>
                </div>

                {/* Courier Transit */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ color: '#ffffff' }}>Courier Transit Navigation ({distanceKm} km)</span>
                    <span style={{ color: '#00b894', fontWeight: '700' }}>{etaResult.factors_breakdown.transit_minutes} mins</span>
                  </div>
                  <div className="ai-progress-bar">
                    <div className="ai-progress-fill" style={{ width: `${Math.min(100, (etaResult.factors_breakdown.transit_minutes / etaResult.predicted_eta_minutes) * 100)}%` }} />
                  </div>
                </div>

                {/* Weather + Traffic Delay */}
                {(etaResult.factors_breakdown.weather_delay_minutes > 0 || etaResult.factors_breakdown.traffic_delay_minutes > 0) && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span style={{ color: '#ffffff' }}>Weather & Traffic Friction Penalties</span>
                      <span style={{ color: '#fdcb6e', fontWeight: '700' }}>
                        {(etaResult.factors_breakdown.weather_delay_minutes + etaResult.factors_breakdown.traffic_delay_minutes).toFixed(1)} mins
                      </span>
                    </div>
                    <div className="ai-progress-bar">
                      <div className="ai-progress-fill" style={{ width: '25%', background: '#fdcb6e' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delay warnings & Customer Reassurance Message */}
          <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CheckCircle size={16} color="#00b894" />
              <span style={{ fontSize: '0.92rem', color: '#ffffff', fontWeight: '600' }}>
                Customer Status Broadcast: {etaResult.customer_status_message}
              </span>
            </div>

            {etaResult.delay_warnings?.map((warn, i) => (
              <div key={i} style={{ fontSize: '0.84rem', color: '#fdcb6e', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <AlertCircle size={14} /> {warn}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EtaPredictorScreen;
