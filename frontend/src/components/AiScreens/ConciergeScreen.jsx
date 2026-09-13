import React, { useState } from 'react';
import { Sparkles, Send, Flame, Heart, Zap, Coffee, Plus, Check } from 'lucide-react';
import { aiService } from '../../apiService/aiService';

const SAMPLE_PROMPTS = [
  { text: '🌶️ Spicy dinner under ₹450 with no dairy', label: 'Spicy No-Dairy' },
  { text: '🥗 High-protein clean vegan bowl', label: 'Vegan Protein' },
  { text: '🍕 Late night wood-fired pizza & craft sides', label: 'Comfort Pizza' },
  { text: '🍫 Indulgent chocolate dessert after a long day', label: 'Sweet Tooth' },
];

const ConciergeScreen = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [addedItems, setAddedItems] = useState({});

  const handleSearch = async (queryText) => {
    const textToSearch = queryText || prompt;
    if (!textToSearch.trim()) return;

    setLoading(true);
    try {
      const data = await aiService.askConcierge(textToSearch);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (chipText) => {
    setPrompt(chipText);
    handleSearch(chipText);
  };

  const toggleAddToTray = (dishId) => {
    setAddedItems((prev) => ({
      ...prev,
      [dishId]: !prev[dishId],
    }));
  };

  return (
    <div className="ai-screen-container">
      {/* Search Bar & Prompt Cards */}
      <div className="ai-glass-card">
        <div className="ai-screen-header">
          <div>
            <h2 className="ai-screen-title">
              <Sparkles size={24} color="#ff4e50" />
              TasteBot Conversational Concierge
            </h2>
            <p className="ai-screen-subtitle">
              Describe whatever flavors, budget limits, or diet rules you're craving in natural language.
            </p>
          </div>
          <span className="ai-badge accent">Gemini 2.5 Flash</span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          style={{ display: 'flex', gap: '10px' }}
        >
          <input
            type="text"
            className="ai-input"
            placeholder="e.g. 'I want spicy comforting food under ₹500 for two with no dairy'..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button type="submit" className="ai-btn-primary" disabled={loading}>
            {loading ? (
              'Thinking...'
            ) : (
              <>
                <Send size={18} />
                Ask Chef AI
              </>
            )}
          </button>
        </form>

        {/* Preset Chips */}
        <div className="ai-chips-row">
          {SAMPLE_PROMPTS.map((p, i) => (
            <button
              key={i}
              type="button"
              className="ai-chip-btn"
              onClick={() => handleChipClick(p.text)}
            >
              {p.text}
            </button>
          ))}
        </div>
      </div>

      {/* AI Recommendation Results */}
      {result && (
        <div className="ai-glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="ai-badge success">Mood: {result.mood_extracted || 'Balanced'}</span>
              <span style={{ fontSize: '0.86rem', color: 'var(--ai-text-muted)' }}>
                Intent: {result.intent}
              </span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 78, 80, 0.08)',
              borderLeft: '4px solid #ff4e50',
              padding: '12px 16px',
              borderRadius: '0 10px 10px 0',
              fontSize: '0.96rem',
              lineHeight: '1.5',
              marginBottom: '20px',
            }}
          >
            {result.reply}
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px' }}>
            Curated Matches ({result.recommended_dishes?.length || 0})
          </h3>

          <div className="ai-dish-grid">
            {result.recommended_dishes?.map((dish) => {
              const isAdded = addedItems[dish.id];
              return (
                <div key={dish.id} className="ai-dish-card">
                  <div>
                    <div className="ai-dish-header">
                      <div>
                        <div className="ai-dish-name">{dish.name}</div>
                        <div className="ai-dish-cuisine">{dish.cuisine} • {dish.calories} kcal</div>
                      </div>
                      <div className="ai-dish-price">₹{dish.price}</div>
                    </div>

                    <p className="ai-dish-reason">{dish.match_reason}</p>
                  </div>

                  <div>
                    <div className="ai-dish-meta">
                      <span>★ {dish.rating} (Rating)</span>
                      <span>
                        {dish.allergens?.length > 0 ? `Allergens: ${dish.allergens.join(', ')}` : 'Allergen-Safe'}
                      </span>
                    </div>

                    <button
                      type="button"
                      className={isAdded ? 'ai-btn-secondary' : 'ai-btn-primary'}
                      style={{ width: '100%', marginTop: '10px' }}
                      onClick={() => toggleAddToTray(dish.id)}
                    >
                      {isAdded ? (
                        <>
                          <Check size={16} color="#00b894" /> Added to Smart Tray
                        </>
                      ) : (
                        <>
                          <Plus size={16} /> Add to Smart Tray
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {result.suggested_followups?.length > 0 && (
            <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--ai-text-muted)', marginBottom: '8px' }}>
                Follow-up with TasteBot:
              </div>
              <div className="ai-chips-row">
                {result.suggested_followups.map((f, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="ai-chip-btn"
                    onClick={() => handleChipClick(f)}
                  >
                    💬 {f}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConciergeScreen;
