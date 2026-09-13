import React, { useState, useEffect } from 'react';
import { ShoppingBag, ShieldAlert, CheckCircle2, Sparkles, Plus, AlertCircle, Utensils } from 'lucide-react';
import { aiService } from '../../apiService/aiService';

const AVAILABLE_TEST_ITEMS = [
  { id: 'dish_1', name: 'Paneer Butter Masala', price: 280, contains: ['Dairy'], is_vegan: false },
  { id: 'dish_2', name: 'Garlic Butter Naan', price: 90, contains: ['Gluten', 'Dairy'], is_vegan: false },
  { id: 'dish_3', name: 'Avocado Poke Bowl', price: 420, contains: ['Soy'], is_vegan: true },
  { id: 'dish_6', name: 'Truffle Funghi Pizza', price: 540, contains: ['Gluten', 'Dairy'], is_vegan: false },
];

const ALLERGIES_OPTIONS = ['Dairy', 'Gluten', 'Vegan', 'Soy', 'Tree Nuts'];

const SmartCartScreen = () => {
  const [cartIds, setCartIds] = useState(['dish_1', 'dish_2']);
  const [selectedAllergies, setSelectedAllergies] = useState(['Dairy']);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const data = await aiService.getSmartCartInsights(cartIds, selectedAllergies);
      setInsights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [cartIds, selectedAllergies]);

  const toggleCartItem = (id) => {
    setCartIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAllergy = (allergy) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
  };

  return (
    <div className="ai-screen-container">
      {/* Configuration Grid */}
      <div className="ai-glass-card">
        <div className="ai-screen-header">
          <div>
            <h2 className="ai-screen-title">
              <ShoppingBag size={24} color="#ff4e50" />
              Smart Cart & Dietary Allergen Guard
            </h2>
            <p className="ai-screen-subtitle">
              Continuous neural cross-check: scans every cart addition against your biological allergy profile and suggests harmonious culinary pairings.
            </p>
          </div>
          <span className="ai-badge success">Live Guard Active</span>
        </div>

        {/* Dietary Profile Selector */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
            Active User Dietary & Allergen Profile:
          </div>
          <div className="ai-chips-row">
            {ALLERGIES_OPTIONS.map((allergy) => {
              const active = selectedAllergies.includes(allergy);
              return (
                <button
                  key={allergy}
                  type="button"
                  className={active ? 'ai-btn-primary' : 'ai-chip-btn'}
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                  onClick={() => toggleAllergy(allergy)}
                >
                  {active ? `✓ ${allergy} Restrained` : `+ ${allergy}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cart items simulator */}
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
            Simulate Cart Contents:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {AVAILABLE_TEST_ITEMS.map((item) => {
              const inCart = cartIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  className={inCart ? 'ai-btn-primary' : 'ai-btn-secondary'}
                  style={{ justifyContent: 'space-between', padding: '10px 14px' }}
                  onClick={() => toggleCartItem(item.id)}
                >
                  <span>{item.name}</span>
                  <span style={{ fontWeight: '800' }}>{inCart ? 'In Cart' : '+ Add'}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Safety Alerts (Critical) */}
      {insights?.safety_alerts?.length > 0 && (
        <div
          className="ai-glass-card"
          style={{
            borderColor: 'rgba(214, 48, 49, 0.4)',
            background: 'rgba(214, 48, 49, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <ShieldAlert size={24} color="#d63031" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ff7675', margin: 0 }}>
              Safety Warning: Allergen Conflict Detected ({insights.safety_alerts.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {insights.safety_alerts.map((alert, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  borderLeft: '4px solid #d63031',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: '#ffffff' }}>{alert.dish_name}</div>
                  <div style={{ fontSize: '0.86rem', color: '#fab1a0' }}>{alert.warning_message}</div>
                </div>
                <span className="ai-badge warning">Severity: {alert.severity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pairings & Nutrition Summary */}
      {insights && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Dynamic AI Pairings */}
          <div className="ai-glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Sparkles size={20} color="#f9d423" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                Intelligent Flavor Pairings
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--ai-text-muted)', marginBottom: '14px' }}>
              {insights.smart_upsell_reason}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {insights.pairing_suggestions?.map((pair) => (
                <div
                  key={pair.dish_id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '12px',
                    borderRadius: '10px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.94rem' }}>{pair.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{pair.pairing_reason}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '800', color: '#f9d423', marginBottom: '4px' }}>₹{pair.price}</div>
                    <button
                      type="button"
                      className="ai-btn-primary"
                      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                      onClick={() => toggleCartItem(pair.dish_id)}
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Nutrition Overview */}
          <div className="ai-glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Utensils size={20} color="#00b894" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                Cart Nutrition Accumulator
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--ai-text-muted)', marginBottom: '14px' }}>
              Aggregate nutritional summary across {insights.cart_items_count} active item(s).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(255, 78, 80, 0.1)', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--ai-text-muted)' }}>Total Energy</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ff4e50' }}>
                  {insights.nutrition_summary.total_calories}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Calories (kcal)</div>
              </div>

              <div style={{ background: 'rgba(108, 92, 231, 0.1)', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--ai-text-muted)' }}>Total Protein</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#a29bfe' }}>
                  {insights.nutrition_summary.total_protein_g}g
                </div>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Muscle Building</div>
              </div>

              <div style={{ background: 'rgba(249, 212, 35, 0.1)', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--ai-text-muted)' }}>Total Carbs</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f9d423' }}>
                  {insights.nutrition_summary.total_carbs_g}g
                </div>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Energy Supply</div>
              </div>

              <div style={{ background: 'rgba(0, 184, 148, 0.1)', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--ai-text-muted)' }}>Total Lipids</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#00b894' }}>
                  {insights.nutrition_summary.total_fat_g}g
                </div>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Healthy Fats</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartCartScreen;
