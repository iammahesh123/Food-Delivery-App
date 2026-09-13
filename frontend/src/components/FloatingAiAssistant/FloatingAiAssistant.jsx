import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  X,
  Send,
  Camera,
  ShoppingBag,
  Timer,
  ExternalLink,
  Plus,
  Check,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import './FloatingAiAssistant.css';
import { aiService } from '../../apiService/aiService';
import { StoreContext } from '../../context/StoreContext';

const QUICK_CHIPS = [
  '🌶️ Spicy under ₹450',
  '🥗 Clean vegan bowl',
  '🍕 Late night pizza',
  '🍫 Sweet comfort dessert',
];

const PRESETS = [
  { id: 'pizza', name: 'Truffle Pizza', emoji: '🍕' },
  { id: 'bowl', name: 'Poke Bowl', emoji: '🥗' },
  { id: 'curry', name: 'Butter Masala', emoji: '🥘' },
  { id: 'burger', name: 'Paneer Burger', emoji: '🍔' },
];

const FloatingAiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('concierge');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [conciergeResult, setConciergeResult] = useState(null);
  const [visualResult, setVisualResult] = useState(null);
  const [cartResult, setCartResult] = useState(null);
  const [etaResult, setEtaResult] = useState(null);
  const [addedItems, setAddedItems] = useState({});

  const { addToCart, cartItems } = useContext(StoreContext);

  // 1. Concierge Query
  const handleConciergeSearch = async (text) => {
    const q = text || prompt;
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await aiService.askConcierge(q);
      setConciergeResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Visual Search Query
  const handleVisualPreset = async (presetId) => {
    setLoading(true);
    try {
      const res = await aiService.searchVisual({ preset_dish_hint: presetId });
      setVisualResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Cart Guard Query
  const handleCheckCart = async () => {
    setLoading(true);
    try {
      const activeIds = Object.keys(cartItems).filter((k) => cartItems[k] > 0);
      const testIds = activeIds.length > 0 ? activeIds : ['dish_1', 'dish_2'];
      const res = await aiService.getSmartCartInsights(testIds, ['Dairy', 'Gluten']);
      setCartResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 4. ETA Predictor Query
  const handlePredictEta = async () => {
    setLoading(true);
    try {
      const res = await aiService.predictEta({
        order_item_count: 3,
        dish_complexity_score: 3,
        kitchen_current_queue: 5,
        distance_km: 3.5,
        weather_condition: 'CLEAR',
        traffic_level: 'MODERATE',
      });
      setEtaResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === 'visual' && !visualResult) handleVisualPreset('pizza');
    if (tab === 'cart' && !cartResult) handleCheckCart();
    if (tab === 'eta' && !etaResult) handlePredictEta();
  };

  const handleAddDish = (dish) => {
    setAddedItems((prev) => ({ ...prev, [dish.id]: true }));
    if (addToCart) addToCart(dish.id);
  };

  return (
    <>
      {/* Pinned Corner Floating Button */}
      {!isOpen && (
        <button
          type="button"
          className="floating-ai-trigger"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
        >
          <Sparkles size={20} className="trigger-icon" />
          <span>Ask Chef AI</span>
        </button>
      )}

      {/* Slide-Up Glassmorphic Drawer (Clean Light Theme) */}
      {isOpen && (
        <div className="floating-ai-drawer fade-in">
          {/* Header */}
          <div className="floating-ai-header">
            <div className="floating-ai-title">
              <Sparkles size={18} color="#e11d48" />
              <span>Chef AI Concierge</span>
              <span
                style={{
                  background: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  borderRadius: '20px',
                  padding: '2px 8px',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                }}
              >
                Online
              </span>
            </div>
            <button
              type="button"
              className="floating-ai-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close Assistant"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick-Action Mode Tabs */}
          <div className="floating-ai-tabs">
            <button
              type="button"
              className={`floating-ai-tab ${activeTab === 'concierge' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('concierge')}
            >
              <Sparkles size={14} />
              <span>TasteBot</span>
            </button>
            <button
              type="button"
              className={`floating-ai-tab ${activeTab === 'visual' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('visual')}
            >
              <Camera size={14} />
              <span>Snap & Crave</span>
            </button>
            <button
              type="button"
              className={`floating-ai-tab ${activeTab === 'cart' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('cart')}
            >
              <ShoppingBag size={14} />
              <span>Cart Guard</span>
            </button>
            <button
              type="button"
              className={`floating-ai-tab ${activeTab === 'eta' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('eta')}
            >
              <Timer size={14} />
              <span>Live ETA</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="floating-ai-body">
            {/* 1. TasteBot Concierge Tab */}
            {activeTab === 'concierge' && (
              <>
                <div style={{ fontSize: '0.86rem', color: '#475569' }}>
                  Tell me what flavors, calories, or budget you're craving:
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleConciergeSearch();
                  }}
                  style={{ display: 'flex', gap: '8px' }}
                >
                  <input
                    type="text"
                    className="floating-ai-input"
                    placeholder="e.g. 'Spicy vegan dinner under 450'..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="floating-ai-btn-primary"
                    style={{ padding: '0 14px' }}
                    disabled={loading}
                  >
                    <Send size={15} />
                  </button>
                </form>

                {/* Quick Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {QUICK_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="floating-ai-chip"
                      onClick={() => {
                        setPrompt(chip);
                        handleConciergeSearch(chip);
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {loading && (
                  <div style={{ textAlign: 'center', color: '#e11d48', fontSize: '0.86rem', padding: '16px', fontWeight: '600' }}>
                    ✨ Chef AI is curating recommendations...
                  </div>
                )}

                {/* Results */}
                {conciergeResult && !loading && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="floating-ai-reply-banner">
                      {conciergeResult.reply}
                    </div>

                    {conciergeResult.recommended_dishes?.map((dish) => {
                      const isAdded = addedItems[dish.id];
                      return (
                        <div key={dish.id} className="floating-ai-dish-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.94rem' }}>
                                {dish.name}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                                {dish.cuisine} • {dish.calories} kcal • <span style={{ color: '#d97706', fontWeight: '700' }}>★ {dish.rating}</span>
                              </div>
                            </div>
                            <div style={{ fontWeight: '800', color: '#e11d48', fontSize: '1.05rem' }}>₹{dish.price}</div>
                          </div>

                          <p style={{ margin: '8px 0', fontSize: '0.82rem', color: '#334155', lineHeight: '1.4' }}>
                            {dish.match_reason}
                          </p>

                          <button
                            type="button"
                            className={isAdded ? 'floating-ai-btn-secondary' : 'floating-ai-btn-primary'}
                            style={{ width: '100%', padding: '7px' }}
                            onClick={() => handleAddDish(dish)}
                          >
                            {isAdded ? (
                              <>
                                <Check size={14} color="#059669" /> Added to Order
                              </>
                            ) : (
                              <>
                                <Plus size={14} /> Add to Order
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* 2. Snap & Crave Tab */}
            {activeTab === 'visual' && (
              <>
                <div style={{ fontSize: '0.86rem', color: '#475569' }}>
                  Tap a plate to simulate visual food detection & calorie scanning:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="floating-ai-btn-secondary"
                      onClick={() => handleVisualPreset(p.id)}
                    >
                      <span>{p.emoji}</span>
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>

                {visualResult && (
                  <div className="floating-ai-dish-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '1rem' }}>
                        {visualResult.identified_dish}
                      </span>
                      <span
                        style={{
                          background: '#ecfdf5',
                          color: '#059669',
                          border: '1px solid #a7f3d0',
                          borderRadius: '14px',
                          padding: '2px 8px',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                        }}
                      >
                        {Math.round(visualResult.confidence_score * 100)}% Match
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', textAlign: 'center', marginBottom: '12px' }}>
                      <div style={{ background: '#fff1f2', border: '1px solid #ffe4e6', padding: '6px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.68rem', color: '#881337' }}>Calories</div>
                        <div style={{ fontWeight: '800', color: '#e11d48', fontSize: '0.92rem' }}>
                          {visualResult.estimated_macros.calories}
                        </div>
                      </div>
                      <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', padding: '6px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.68rem', color: '#1e40af' }}>Protein</div>
                        <div style={{ fontWeight: '800', color: '#2563eb', fontSize: '0.92rem' }}>
                          {visualResult.estimated_macros.protein_g}g
                        </div>
                      </div>
                      <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '6px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.68rem', color: '#92400e' }}>Carbs</div>
                        <div style={{ fontWeight: '800', color: '#d97706', fontSize: '0.92rem' }}>
                          {visualResult.estimated_macros.carbs_g}g
                        </div>
                      </div>
                      <div style={{ background: '#ecfdf5', border: '1px solid #d1fae5', padding: '6px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.68rem', color: '#065f46' }}>Fats</div>
                        <div style={{ fontWeight: '800', color: '#059669', fontSize: '0.92rem' }}>
                          {visualResult.estimated_macros.fat_g}g
                        </div>
                      </div>
                    </div>

                    {visualResult.matching_catalog_items?.[0] && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          padding: '10px 12px',
                          borderRadius: '8px',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#0f172a' }}>
                            {visualResult.matching_catalog_items[0].name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#e11d48', fontWeight: '700' }}>
                            ₹{visualResult.matching_catalog_items[0].price}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="floating-ai-btn-primary"
                          style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                          onClick={() => handleAddDish(visualResult.matching_catalog_items[0])}
                        >
                          <Plus size={13} /> Add
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* 3. Cart Guard Tab */}
            {activeTab === 'cart' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.86rem', color: '#475569' }}>Allergen Check (Dairy & Gluten):</span>
                  <button
                    type="button"
                    className="floating-ai-btn-secondary"
                    style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                    onClick={handleCheckCart}
                  >
                    Re-check
                  </button>
                </div>

                {cartResult && (
                  <>
                    {cartResult.safety_alerts?.length > 0 ? (
                      <div
                        style={{
                          background: '#fff1f2',
                          borderLeft: '4px solid #e11d48',
                          padding: '10px 12px',
                          borderRadius: '0 8px 8px 0',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e11d48', fontWeight: '700', fontSize: '0.84rem', marginBottom: '4px' }}>
                          <ShieldAlert size={14} /> Allergen Warning Detected
                        </div>
                        {cartResult.safety_alerts.map((a, i) => (
                          <div key={i} style={{ fontSize: '0.8rem', color: '#881337', marginTop: '2px' }}>
                            • <strong>{a.dish_name}</strong>: {a.warning_message}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          background: '#ecfdf5',
                          border: '1px solid #a7f3d0',
                          color: '#059669',
                          borderRadius: '8px',
                          padding: '8px',
                          textAlign: 'center',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                        }}
                      >
                        ✓ All Cart Items Safe from Stated Allergens
                      </div>
                    )}

                    <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0f172a', marginTop: '6px' }}>
                      ✨ Recommended Pairings for Your Cart:
                    </div>
                    {cartResult.pairing_suggestions?.map((pair) => (
                      <div
                        key={pair.dish_id}
                        className="floating-ai-dish-card"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px' }}
                      >
                        <div>
                          <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#0f172a' }}>{pair.name}</div>
                          <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{pair.pairing_reason}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#e11d48' }}>₹{pair.price}</div>
                          <button
                            type="button"
                            className="floating-ai-btn-primary"
                            style={{ padding: '3px 8px', fontSize: '0.72rem', marginTop: '2px' }}
                            onClick={() => handleAddDish({ id: pair.dish_id, name: pair.name, price: pair.price })}
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}

            {/* 4. Live ETA Tab */}
            {activeTab === 'eta' && (
              <>
                <div style={{ fontSize: '0.86rem', color: '#475569' }}>
                  Live Kitchen Load & Delivery Arrival Calculator:
                </div>
                {etaResult ? (
                  <div
                    style={{
                      textAlign: 'center',
                      background: '#ffffff',
                      borderRadius: '14px',
                      padding: '18px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
                    }}
                  >
                    <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>
                      Predicted Delivery Arrival
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: '900', color: '#e11d48', margin: '4px 0' }}>
                      {etaResult.predicted_eta_minutes}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#d97706', fontWeight: '700' }}>Minutes</div>
                    <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '8px', lineHeight: '1.4' }}>
                      {etaResult.customer_status_message}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="floating-ai-btn-primary"
                    onClick={handlePredictEta}
                    style={{ width: '100%', padding: '10px' }}
                  >
                    Calculate Live ETA
                  </button>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="floating-ai-footer">
            <span>Powered by Gemini AI</span>
            <Link
              to="/ai-hub"
              className="floating-ai-hub-link"
              onClick={() => setIsOpen(false)}
            >
              Full AI Studio <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAiAssistant;
