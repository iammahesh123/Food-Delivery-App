import React, { useState, useEffect } from 'react';
import { MessageSquareQuote, TrendingUp, ThumbsUp, AlertTriangle, Send, Copy, Check } from 'lucide-react';
import { aiService } from '../../apiService/aiService';

const SAMPLE_REVIEWS = [
  {
    id: 'rev_1',
    customer_name: 'Aarav Sharma',
    rating: 5.0,
    text: 'The Paneer Butter Masala was absolutely delicious, rich gravy and arrived piping hot! Best dinner this week.',
  },
  {
    id: 'rev_2',
    customer_name: 'Neha Kapoor',
    rating: 2.0,
    text: 'Delivery was 25 minutes late and the curry container leaked inside the paper bag. Very messy experience.',
  },
  {
    id: 'rev_3',
    customer_name: 'Vikram Mehta',
    rating: 4.5,
    text: 'Truffle pizza crust is sensational. Crispy edges and generous toppings. A bit pricey but worth the treat!',
  },
];

const ReviewSentimentScreen = () => {
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [copiedId, setCopiedId] = useState('');

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const data = await aiService.analyzeReviewSentiment(reviews);
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  const copyReply = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  return (
    <div className="ai-screen-container">
      {/* Header & Aspect Meters */}
      <div className="ai-glass-card">
        <div className="ai-screen-header">
          <div>
            <h2 className="ai-screen-title">
              <MessageSquareQuote size={24} color="#ff4e50" />
              Aspect-Based Review Sentiment & Auto-Responder
            </h2>
            <p className="ai-screen-subtitle">
              Deconstructs real customer feedback into granular operational pillars: Taste, Courier Transit, Packaging Integrity, and Value perception.
            </p>
          </div>
          <button type="button" className="ai-btn-primary" onClick={runAnalysis} disabled={loading}>
            {loading ? 'Analyzing Sentiment...' : '🔄 Re-Analyze Reviews'}
          </button>
        </div>

        {analysis && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {/* Taste */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>Taste & Recipe Flavor</span>
                  <span style={{ color: '#00b894', fontWeight: '800' }}>{analysis.aspect_scores.taste_and_flavor} / 5.0</span>
                </div>
                <div className="ai-progress-bar">
                  <div className="ai-progress-fill" style={{ width: `${(analysis.aspect_scores.taste_and_flavor / 5) * 100}%` }} />
                </div>
              </div>

              {/* Delivery */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>Delivery Speed & Temp</span>
                  <span style={{ color: '#fdcb6e', fontWeight: '800' }}>{analysis.aspect_scores.delivery_and_temp} / 5.0</span>
                </div>
                <div className="ai-progress-bar">
                  <div className="ai-progress-fill" style={{ width: `${(analysis.aspect_scores.delivery_and_temp / 5) * 100}%` }} />
                </div>
              </div>

              {/* Packaging */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>Packaging Integrity</span>
                  <span style={{ color: '#ff7675', fontWeight: '800' }}>{analysis.aspect_scores.packaging_integrity} / 5.0</span>
                </div>
                <div className="ai-progress-bar">
                  <div className="ai-progress-fill" style={{ width: `${(analysis.aspect_scores.packaging_integrity / 5) * 100}%` }} />
                </div>
              </div>

              {/* Value */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>Value for Money</span>
                  <span style={{ color: '#f9d423', fontWeight: '800' }}>{analysis.aspect_scores.value_for_money} / 5.0</span>
                </div>
                <div className="ai-progress-bar">
                  <div className="ai-progress-fill" style={{ width: `${(analysis.aspect_scores.value_for_money / 5) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Praise & Pain points */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginTop: '16px' }}>
              <div style={{ background: 'rgba(0, 184, 148, 0.08)', border: '1px solid rgba(0, 184, 148, 0.25)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00b894', fontWeight: '700', fontSize: '0.88rem', marginBottom: '6px' }}>
                  <ThumbsUp size={16} /> Key Praise Themes
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.86rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                  {analysis.praise_highlights?.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: 'rgba(214, 48, 49, 0.08)', border: '1px solid rgba(214, 48, 49, 0.25)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff7675', fontWeight: '700', fontSize: '0.88rem', marginBottom: '6px' }}>
                  <AlertTriangle size={16} /> Operational Action Alerts
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.86rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                  {analysis.critical_pain_points?.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reviews Feed & 1-Click AI Responses */}
      {analysis && (
        <div className="ai-glass-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '14px' }}>
            Customer Reviews & 1-Click AI Response Drafter
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviews.map((r) => {
              const suggested = analysis.suggested_replies?.find((s) => s.review_id === r.id);
              const isCopied = copiedId === r.id;
              return (
                <div
                  key={r.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: '700', color: '#ffffff' }}>{r.customer_name}</span>
                      <span style={{ color: '#f9d423', fontSize: '0.86rem' }}>{'★'.repeat(Math.round(r.rating))}</span>
                    </div>
                    {suggested && (
                      <span className={`ai-badge ${suggested.reply_tone === 'Empathetic' ? 'warning' : 'success'}`}>
                        Tone: {suggested.reply_tone}
                      </span>
                    )}
                  </div>

                  <p style={{ margin: '0 0 12px 0', fontSize: '0.92rem', color: '#cbd5e1' }}>
                    "{r.text}"
                  </p>

                  {/* AI Response Card */}
                  {suggested && (
                    <div
                      style={{
                        background: 'rgba(108, 92, 231, 0.09)',
                        borderLeft: '4px solid #6c5ce7',
                        padding: '12px 14px',
                        borderRadius: '0 10px 10px 0',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#a29bfe' }}>
                          AI Drafted Merchant Reply:
                        </span>
                        <button
                          type="button"
                          className="ai-btn-secondary"
                          style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                          onClick={() => copyReply(suggested.draft_response, r.id)}
                        >
                          {isCopied ? <Check size={12} color="#00b894" /> : <Copy size={12} />}
                          {isCopied ? 'Copied' : '1-Click Copy'}
                        </button>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: '#ffffff', lineHeight: '1.45' }}>
                        {suggested.draft_response}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSentimentScreen;
