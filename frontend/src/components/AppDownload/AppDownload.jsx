import React from 'react';
import './AppDownload.css';
import { assets } from '../../assets/assets';
import { Smartphone, CheckCircle2, Star, QrCode, Sparkles } from 'lucide-react';

const AppDownload = () => {
  return (
    <div className="app-download-section" id="app-download">
      <div className="app-download-card">
        {/* Left: Value Proposition & Store Badges */}
        <div className="app-download-content">
          <div className="app-badge-pill">
            <Sparkles size={14} className="text-orange" />
            <span>Tomato Mobile App</span>
          </div>

          <h2 className="app-download-title">
            Delicious food at your fingertips. <br />
            Download the app today.
          </h2>

          <p className="app-download-desc">
            Enjoy faster checkout, exclusive weekly vouchers, and live turn-by-turn driver tracking from kitchen to your door.
          </p>

          <div className="app-perks-list">
            <div className="perk-item">
              <CheckCircle2 size={16} className="perk-icon" />
              <span>Real-time GPS courier tracking</span>
            </div>
            <div className="perk-item">
              <CheckCircle2 size={16} className="perk-icon" />
              <span>Exclusive mobile-only coupons & flash deals</span>
            </div>
            <div className="perk-item">
              <CheckCircle2 size={16} className="perk-icon" />
              <span>1-tap instant reordering of past favorites</span>
            </div>
          </div>

          <div className="app-download-actions">
            <div className="app-download-platforms">
              <img src={assets.play_store} alt="Download on Google Play" className="store-badge-img" />
              <img src={assets.app_store} alt="Download on Apple App Store" className="store-badge-img" />
            </div>

            <div className="app-rating-pill">
              <div className="stars-cluster">
                <Star size={14} className="star-filled" />
                <Star size={14} className="star-filled" />
                <Star size={14} className="star-filled" />
                <Star size={14} className="star-filled" />
                <Star size={14} className="star-filled" />
              </div>
              <span className="rating-num">4.9</span>
              <span className="rating-divider">•</span>
              <span className="rating-count">50,000+ Downloads</span>
            </div>
          </div>
        </div>

        {/* Right: QR Code & Mobile Visual Card */}
        <div className="app-download-visual">
          <div className="qr-box-card">
            <div className="qr-icon-header">
              <QrCode size={36} className="qr-icon" />
              <div className="qr-text">
                <strong>Scan to Install</strong>
                <span>Camera opens app directly</span>
              </div>
            </div>

            <div className="qr-illustration">
              {/* Clean decorative simulated QR frame */}
              <div className="simulated-qr">
                <div className="qr-corner top-left"></div>
                <div className="qr-corner top-right"></div>
                <div className="qr-corner bottom-left"></div>
                <div className="qr-center-logo">
                  <Smartphone size={28} className="text-orange" />
                </div>
              </div>
            </div>

            <div className="qr-footer-pill">
              <span>Supports iOS 15+ & Android 10+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDownload;
