import React, { useState, useEffect } from 'react';
import { Sparkles, Camera, ShoppingBag, ChefHat, MessageSquareQuote, Calendar, Timer } from 'lucide-react';
import './AiHub.css';
import '../..//components/AiScreens/AiScreens.css';

import ConciergeScreen from '../../components/AiScreens/ConciergeScreen';
import VisualSearchScreen from '../../components/AiScreens/VisualSearchScreen';
import SmartCartScreen from '../../components/AiScreens/SmartCartScreen';
import MenuCopilotScreen from '../../components/AiScreens/MenuCopilotScreen';
import ReviewSentimentScreen from '../../components/AiScreens/ReviewSentimentScreen';
import EventBundlerScreen from '../../components/AiScreens/EventBundlerScreen';
import EtaPredictorScreen from '../../components/AiScreens/EtaPredictorScreen';
import { aiService } from '../../apiService/aiService';

const TABS = [
  { id: 'concierge', label: 'TasteBot Concierge', icon: Sparkles },
  { id: 'visual', label: 'Snap & Crave', icon: Camera },
  { id: 'cart', label: 'Smart Cart & Allergen Guard', icon: ShoppingBag },
  { id: 'menu', label: 'Merchant Menu Studio', icon: ChefHat },
  { id: 'sentiment', label: 'Review Sentiment NLP', icon: MessageSquareQuote },
  { id: 'events', label: 'Night-Out Event Bundler', icon: Calendar },
  { id: 'eta', label: 'Predictive ETA Engine', icon: Timer },
];

const AiHub = () => {
  const [activeTab, setActiveTab] = useState('concierge');
  const [healthStatus, setHealthStatus] = useState({ connected: false, mode: 'Initializing...' });

  useEffect(() => {
    const checkStatus = async () => {
      const res = await aiService.checkHealth();
      setHealthStatus({
        connected: res.connected,
        mode: res.data?.mode || (res.connected ? 'FastAPI Microservice' : 'Built-in Neural Fallback'),
      });
    };
    checkStatus();
  }, []);

  return (
    <div className="ai-hub-wrapper">
      {/* Header Banner */}
      <div className="ai-hub-header">
        <div className="ai-hub-pill">
          <Sparkles size={14} /> AI Food Intelligence Suite
        </div>
        <h1 className="ai-hub-title">Next-Gen Food & Dining AI</h1>
        <p className="ai-hub-subtitle">
          Explore all 7 end-to-end artificial intelligence capabilities powering customer food discovery,
          multi-modal visual search, merchant operations, and dynamic logistics.
        </p>

        <div className="ai-hub-status-bar">
          <div
            className="ai-status-dot"
            style={{
              background: healthStatus.connected ? '#00b894' : '#fdcb6e',
              boxShadow: healthStatus.connected ? '0 0 8px #00b894' : '0 0 8px #fdcb6e',
            }}
          />
          <span style={{ color: '#cbd5e1' }}>
            AI Engine: <strong style={{ color: '#ffffff' }}>{healthStatus.mode}</strong>
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="ai-hub-nav-tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`ai-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Stage: Render Active Screen */}
      <div className="ai-hub-content-stage">
        {activeTab === 'concierge' && <ConciergeScreen />}
        {activeTab === 'visual' && <VisualSearchScreen />}
        {activeTab === 'cart' && <SmartCartScreen />}
        {activeTab === 'menu' && <MenuCopilotScreen />}
        {activeTab === 'sentiment' && <ReviewSentimentScreen />}
        {activeTab === 'events' && <EventBundlerScreen />}
        {activeTab === 'eta' && <EtaPredictorScreen />}
      </div>
    </div>
  );
};

export default AiHub;
