import React, { useState } from 'react';
import { Camera, Image as ImageIcon, CheckCircle, AlertTriangle, ShieldCheck, ShoppingCart } from 'lucide-react';
import { aiService } from '../../apiService/aiService';

const PRESET_DISHES = [
  { id: 'pizza', name: 'Wood-Fired Truffle Pizza', emoji: '🍕', cuisine: 'Italian' },
  { id: 'bowl', name: 'Avocado Edamame Poke', emoji: '🥗', cuisine: 'Japanese Fusion' },
  { id: 'curry', name: 'Paneer Butter Masala', emoji: '🥘', cuisine: 'North Indian' },
  { id: 'burger', name: 'Smoky BBQ Paneer Burger', emoji: '🍔', cuisine: 'American Gourmet' },
];

const VisualSearchScreen = () => {
  const [selectedPreset, setSelectedPreset] = useState('pizza');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleRecognize = async (presetId) => {
    setSelectedPreset(presetId);
    setLoading(true);
    try {
      const res = await aiService.searchVisual({ preset_dish_hint: presetId });
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-screen-container">
      {/* Upload & Preset Selector */}
      <div className="ai-glass-card">
        <div className="ai-screen-header">
          <div>
            <h2 className="ai-screen-title">
              <Camera size={24} color="#ff4e50" />
              Snap & Crave Visual Food AI
            </h2>
            <p className="ai-screen-subtitle">
              Multi-modal vision analysis: identifies dish, nutrition macros, allergens, and matches available catalog items.
            </p>
          </div>
          <span className="ai-badge accent">Vision Multi-modal</span>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '0.88rem', color: 'var(--ai-text-muted)', marginBottom: '8px' }}>
            Choose sample gourmet plate or simulate camera capture:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            {PRESET_DISHES.map((dish) => (
              <button
                key={dish.id}
                type="button"
                className={selectedPreset === dish.id ? 'ai-btn-primary' : 'ai-btn-secondary'}
                style={{ justifyContent: 'center', padding: '12px 10px' }}
                onClick={() => handleRecognize(dish.id)}
              >
                <span style={{ fontSize: '1.2rem' }}>{dish.emoji}</span>
                <span>{dish.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dropzone mock */}
        <div
          style={{
            border: '2px dashed rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            cursor: 'pointer',
          }}
          onClick={() => handleRecognize(selectedPreset)}
        >
          <ImageIcon size={32} color="#a0aec0" style={{ margin: '0 auto 8px auto' }} />
          <div style={{ fontSize: '0.92rem', color: '#e2e8f0', fontWeight: '600' }}>
            Drag & Drop dish photo or click to analyze
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ai-text-muted)', marginTop: '4px' }}>
            Supports JPG, PNG, WEBP (analyzed with Google Gemini Vision)
          </div>
        </div>
      </div>

      {/* Results View */}
      {loading && (
        <div className="ai-glass-card" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '1.1rem', color: '#f9d423', fontWeight: '700' }}>
            ✨ Multi-modal Vision Model Analyzing Dish Elements...
          </div>
          <div style={{ fontSize: '0.86rem', color: 'var(--ai-text-muted)', marginTop: '8px' }}>
            Extracting ingredient boundaries, estimating macro density, and cross-matching catalog...
          </div>
        </div>
      )}

      {data && !loading && (
        <div className="ai-glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span className="ai-badge success">Confidence: {Math.round(data.confidence_score * 100)}%</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '8px', color: '#ffffff' }}>
                {data.identified_dish}
              </h3>
              <div style={{ fontSize: '0.88rem', color: 'var(--ai-text-muted)' }}>
                Cuisine: {data.cuisine}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {data.dietary_flags?.map((flag, i) => (
                <span key={i} className="ai-badge accent">
                  <CheckCircle size={13} /> {flag}
                </span>
              ))}
            </div>
          </div>

          {/* Macro Nutrient Breakdown Cards */}
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '10px' }}>
              Estimated Nutritional Composition (Per Serving)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'rgba(255, 78, 80, 0.1)', border: '1px solid rgba(255, 78, 80, 0.25)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--ai-text-muted)' }}>Calories</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ff4e50' }}>{data.estimated_macros.calories}</div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>kcal</div>
              </div>

              <div style={{ background: 'rgba(108, 92, 231, 0.1)', border: '1px solid rgba(108, 92, 231, 0.25)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--ai-text-muted)' }}>Protein</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#a29bfe' }}>{data.estimated_macros.protein_g}g</div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>High biological value</div>
              </div>

              <div style={{ background: 'rgba(249, 212, 35, 0.1)', border: '1px solid rgba(249, 212, 35, 0.25)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--ai-text-muted)' }}>Carbohydrates</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f9d423' }}>{data.estimated_macros.carbs_g}g</div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Slow digestive energy</div>
              </div>

              <div style={{ background: 'rgba(0, 184, 148, 0.1)', border: '1px solid rgba(0, 184, 148, 0.25)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--ai-text-muted)' }}>Healthy Fats</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#00b894' }}>{data.estimated_macros.fat_g}g</div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Monounsaturated lipids</div>
              </div>
            </div>
          </div>

          {/* Allergens */}
          <div style={{ marginTop: '20px', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <AlertTriangle size={16} color="#fdcb6e" />
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>Detected Allergen Traces</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {data.detected_allergens?.length > 0 ? (
                data.detected_allergens.map((a, i) => (
                  <span key={i} className="ai-badge warning">{a}</span>
                ))
              ) : (
                <span className="ai-badge success">No common allergens detected</span>
              )}
            </div>
          </div>

          {/* Menu Catalog Match */}
          <div style={{ marginTop: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>
              Closest Available Match on Our Menu
            </h4>
            {data.matching_catalog_items?.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff' }}>{item.name}</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--ai-text-muted)' }}>
                    {item.cuisine} • Match Score: {Math.round(item.similarity_score * 100)}%
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f9d423' }}>₹{item.price}</div>
                  <button type="button" className="ai-btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    <ShoppingCart size={15} /> Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualSearchScreen;
