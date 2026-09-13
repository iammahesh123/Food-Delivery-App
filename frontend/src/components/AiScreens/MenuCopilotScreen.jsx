import React, { useState } from 'react';
import { ChefHat, Wand2, Copy, Check, DollarSign, Tag, AlertCircle, Share2 } from 'lucide-react';
import { aiService } from '../../apiService/aiService';

const MenuCopilotScreen = () => {
  const [dishName, setDishName] = useState('Smoked Truffle Risotto');
  const [cuisine, setCuisine] = useState('Italian');
  const [ingredients, setIngredients] = useState('Arborio Rice, Porcini Mushrooms, Black Truffle Oil, Parmigiano Reggiano');
  const [targetVibe, setTargetVibe] = useState('Gourmet');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState('');

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!dishName.trim()) return;

    setLoading(true);
    try {
      const ingList = ingredients.split(',').map((s) => s.trim()).filter(Boolean);
      const data = await aiService.generateMenuCopy({
        dish_name: dishName,
        cuisine,
        key_ingredients: ingList,
        target_vibe: targetVibe,
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  return (
    <div className="ai-screen-container">
      {/* Merchant Input Form */}
      <div className="ai-glass-card">
        <div className="ai-screen-header">
          <div>
            <h2 className="ai-screen-title">
              <ChefHat size={24} color="#ff4e50" />
              Merchant AI Studio & Menu Copilot
            </h2>
            <p className="ai-screen-subtitle">
              Transform basic ingredient lists into Michelin-star culinary descriptions, automated allergen badges, and margin-optimizing pricing benchmarks.
            </p>
          </div>
          <span className="ai-badge accent">Merchant Backoffice AI</span>
        </div>

        <form onSubmit={handleGenerate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.84rem', color: 'var(--ai-text-muted)', marginBottom: '4px', display: 'block' }}>
              Dish Name
            </label>
            <input
              type="text"
              className="ai-input"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              placeholder="e.g. Artisanal Truffle Pasta"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.84rem', color: 'var(--ai-text-muted)', marginBottom: '4px', display: 'block' }}>
              Cuisine Style
            </label>
            <input
              type="text"
              className="ai-input"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              placeholder="e.g. Italian, North Indian, Pan-Asian"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.84rem', color: 'var(--ai-text-muted)', marginBottom: '4px', display: 'block' }}>
              Target Vibe / Tone
            </label>
            <select
              className="ai-select"
              value={targetVibe}
              onChange={(e) => setTargetVibe(e.target.value)}
            >
              <option value="Gourmet">Michelin Gourmet Editorial</option>
              <option value="Casual">Casual Street & Friendly</option>
              <option value="Healthy">Clean Nutrition & Fitness</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.84rem', color: 'var(--ai-text-muted)', marginBottom: '4px', display: 'block' }}>
              Key Ingredients (comma separated)
            </label>
            <input
              type="text"
              className="ai-input"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g. Black Truffle, Heavy Cream, Garlic, Rosemary"
              required
            />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '6px' }}>
            <button type="submit" className="ai-btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? (
                'Generating Culinary Blueprint...'
              ) : (
                <>
                  <Wand2 size={18} /> Generate Descriptions, Allergens & Price Benchmarks
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Results */}
      {result && (
        <div className="ai-glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span className="ai-badge success">Blueprint Generated</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', marginTop: '6px' }}>
                {result.dish_name} ({result.cuisine})
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {result.culinary_tags?.map((t, i) => (
                <span key={i} className="ai-badge accent">
                  <Tag size={12} /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* 3 Editorial Description Tones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
            {/* Tone 1: Short & Punchy */}
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f9d423' }}>
                  1. Short & Punchy (For Fast Mobile Menu Scanning)
                </span>
                <button
                  type="button"
                  className="ai-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  onClick={() => copyToClipboard(result.descriptions.short_punchy, 'short')}
                >
                  {copiedKey === 'short' ? <Check size={12} color="#00b894" /> : <Copy size={12} />}
                  {copiedKey === 'short' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p style={{ margin: 0, fontSize: '0.94rem', color: '#e2e8f0', lineHeight: '1.4' }}>
                {result.descriptions.short_punchy}
              </p>
            </div>

            {/* Tone 2: Gourmet Editorial */}
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ff7675' }}>
                  2. Gourmet Storytelling (For High-Ticket Dinner Menus)
                </span>
                <button
                  type="button"
                  className="ai-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  onClick={() => copyToClipboard(result.descriptions.gourmet_editorial, 'gourmet')}
                >
                  {copiedKey === 'gourmet' ? <Check size={12} color="#00b894" /> : <Copy size={12} />}
                  {copiedKey === 'gourmet' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p style={{ margin: 0, fontSize: '0.94rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                {result.descriptions.gourmet_editorial}
              </p>
            </div>

            {/* Tone 3: Health & Craft */}
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#00b894' }}>
                  3. Clean Eating & Craft (For Health-Conscious Customers)
                </span>
                <button
                  type="button"
                  className="ai-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  onClick={() => copyToClipboard(result.descriptions.health_and_craft, 'health')}
                >
                  {copiedKey === 'health' ? <Check size={12} color="#00b894" /> : <Copy size={12} />}
                  {copiedKey === 'health' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p style={{ margin: 0, fontSize: '0.94rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                {result.descriptions.health_and_craft}
              </p>
            </div>
          </div>

          {/* Pricing & Allergens Dual Panel */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Pricing Benchmark */}
            <div style={{ background: 'rgba(249, 212, 35, 0.07)', border: '1px solid rgba(249, 212, 35, 0.25)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <DollarSign size={18} color="#f9d423" />
                <span style={{ fontWeight: '700', color: '#f9d423' }}>Dynamic Pricing Benchmark</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>
                  ₹{result.pricing_benchmark.recommended_price}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--ai-text-muted)' }}>
                  (Range: ₹{result.pricing_benchmark.suggested_min} - ₹{result.pricing_benchmark.suggested_max})
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.4', margin: 0 }}>
                {result.pricing_benchmark.market_reasoning}
              </p>
            </div>

            {/* Inferred Allergens */}
            <div style={{ background: 'rgba(255, 78, 80, 0.07)', border: '1px solid rgba(255, 78, 80, 0.25)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <AlertCircle size={18} color="#ff4e50" />
                <span style={{ fontWeight: '700', color: '#ff4e50' }}>Automated Allergen Flags</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {result.detected_allergens?.length > 0 ? (
                  result.detected_allergens.map((a, i) => (
                    <span key={i} className="ai-badge warning">{a}</span>
                  ))
                ) : (
                  <span className="ai-badge success">Zero Allergen Traces</span>
                )}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--ai-text-muted)', margin: 0 }}>
                Automatically flagged to protect diners with sensitivities and meet regulatory labeling.
              </p>
            </div>
          </div>

          {/* Social Hook */}
          {result.social_media_hook && (
            <div style={{ marginTop: '18px', padding: '14px', background: 'rgba(108, 92, 231, 0.1)', border: '1px solid rgba(108, 92, 231, 0.3)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: '700', color: '#a29bfe', marginBottom: '4px' }}>
                  <Share2 size={14} /> Ready-to-Post Instagram / Marketing Hook
                </div>
                <div style={{ fontSize: '0.9rem', color: '#ffffff' }}>{result.social_media_hook}</div>
              </div>
              <button
                type="button"
                className="ai-btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                onClick={() => copyToClipboard(result.social_media_hook, 'social')}
              >
                {copiedKey === 'social' ? <Check size={12} color="#00b894" /> : <Copy size={12} />}
                {copiedKey === 'social' ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuCopilotScreen;
