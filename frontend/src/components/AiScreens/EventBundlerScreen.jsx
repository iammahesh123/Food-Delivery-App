import React, { useState, useEffect } from 'react';
import { Calendar, Users, Heart, MapPin, Clock, Ticket, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { aiService } from '../../apiService/aiService';

const SAMPLE_EVENTS = [
  { id: 'event_1', title: 'Acoustic Sunset Sessions: Indie Live Gig', genre: 'Live Music', venue: 'Amphitheatre Grounds', time: '20:00 - 22:15', price: 499 },
  { id: 'event_2', title: 'The Big Laugh Comedy Club Special', genre: 'Stand-up Comedy', venue: 'Downtown Comedy Vault', time: '19:30 - 21:00', price: 599 },
  { id: 'event_3', title: 'Neon Symphony: Electronic Melodic Night', genre: 'DJ / Melodic', venue: 'Warehouse 54', time: '21:30 - 01:30', price: 799 },
];

const EventBundlerScreen = () => {
  const [selectedEventId, setSelectedEventId] = useState('event_1');
  const [partySize, setPartySize] = useState(2);
  const [diningVibe, setDiningVibe] = useState('Romantic');
  const [timingPref, setTimingPref] = useState('PRE_EVENT');
  const [loading, setLoading] = useState(false);
  const [bundle, setBundle] = useState(null);

  const fetchBundle = async () => {
    setLoading(true);
    try {
      const data = await aiService.bundleEventDining({
        event_id: selectedEventId,
        party_size: partySize,
        dining_vibe: diningVibe,
        timing_preference: timingPref,
      });
      setBundle(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBundle();
  }, [selectedEventId, partySize, diningVibe, timingPref]);

  return (
    <div className="ai-screen-container">
      {/* Event Selection Form */}
      <div className="ai-glass-card">
        <div className="ai-screen-header">
          <div>
            <h2 className="ai-screen-title">
              <Calendar size={24} color="#ff4e50" />
              Night-Out Event & Dining Bundler
            </h2>
            <p className="ai-screen-subtitle">
              Synchronize live event attendance with nearby candlelit or lively dining reservations for a perfectly timed, stress-free evening.
            </p>
          </div>
          <span className="ai-badge accent">Event + Dining Sync</span>
        </div>

        {/* Events Cards */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '0.86rem', color: 'var(--ai-text-muted)', marginBottom: '8px' }}>
            Select Live Event:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            {SAMPLE_EVENTS.map((ev) => {
              const isSelected = selectedEventId === ev.id;
              return (
                <div
                  key={ev.id}
                  style={{
                    background: isSelected ? 'rgba(255, 78, 80, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid #ff4e50' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => setSelectedEventId(ev.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="ai-badge accent" style={{ fontSize: '0.74rem' }}>{ev.genre}</span>
                    <span style={{ fontWeight: '800', color: '#f9d423' }}>₹{ev.price} / ticket</span>
                  </div>
                  <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.96rem', marginBottom: '4px' }}>
                    {ev.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--ai-text-muted)' }}>
                    📍 {ev.venue} • 🕒 {ev.time}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.84rem', color: 'var(--ai-text-muted)', marginBottom: '4px', display: 'block' }}>
              Party Size: {partySize} Guest(s)
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 4, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={partySize === num ? 'ai-btn-primary' : 'ai-btn-secondary'}
                  style={{ flex: 1, padding: '8px 0', justifyContent: 'center' }}
                  onClick={() => setPartySize(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.84rem', color: 'var(--ai-text-muted)', marginBottom: '4px', display: 'block' }}>
              Dining Atmosphere
            </label>
            <select
              className="ai-select"
              value={diningVibe}
              onChange={(e) => setDiningVibe(e.target.value)}
            >
              <option value="Romantic">Romantic & Courtyard</option>
              <option value="Casual">Casual & Organic</option>
              <option value="Party">Party & Cocktails</option>
              <option value="FineDining">Fine Dining Elegance</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.84rem', color: 'var(--ai-text-muted)', marginBottom: '4px', display: 'block' }}>
              Schedule Flow
            </label>
            <select
              className="ai-select"
              value={timingPref}
              onChange={(e) => setTimingPref(e.target.value)}
            >
              <option value="PRE_EVENT">Pre-Event Dinner (Before Show)</option>
              <option value="POST_EVENT">Post-Event Drinks & Dinner (After Show)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Synchronized Itinerary Output */}
      {bundle && (
        <div className="ai-glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
            <div>
              <span className="ai-badge success">Itinerary Synchronized</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', marginTop: '6px' }}>
                Your Curated Evening Plan
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: '4px 0 0 0' }}>
                {bundle.ai_curator_note}
              </p>
            </div>

            <div style={{ background: 'rgba(249, 212, 35, 0.1)', border: '1px solid rgba(249, 212, 35, 0.3)', padding: '12px 18px', borderRadius: '12px', textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--ai-text-muted)' }}>Estimated Night-Out Budget</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f9d423' }}>
                ₹{bundle.total_estimated_budget}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Tickets + Dining for {partySize}</div>
            </div>
          </div>

          {/* Reserved Restaurant Highlight */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(255, 78, 80, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UtensilsCrossed size={22} color="#ff4e50" />
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff' }}>
                  {bundle.dining_recommendation.restaurant_name}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--ai-text-muted)' }}>
                  {bundle.dining_recommendation.cuisine} • {bundle.dining_recommendation.distance_to_venue_km} km from venue
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--ai-text-muted)' }}>Reserved Table Time</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f9d423' }}>
                  {bundle.dining_recommendation.reserved_time}
                </div>
              </div>
              <button type="button" className="ai-btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                1-Click Reserve Both
              </button>
            </div>
          </div>

          {/* Interactive Timeline */}
          <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>
            Chronological Evening Timeline
          </h4>

          <div className="ai-timeline">
            {bundle.timeline?.map((step, idx) => (
              <div key={idx} className="ai-timeline-item">
                <div className="ai-timeline-dot" />
                <div className="ai-timeline-time">{step.time}</div>
                <div className="ai-timeline-title">{step.title}</div>
                <div className="ai-timeline-desc">{step.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventBundlerScreen;
