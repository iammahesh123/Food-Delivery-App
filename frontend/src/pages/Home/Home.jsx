import React, { useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';
import Collections from '../../components/Collections/Collections';
import ProvideServices from '../../components/ProvideServices/ProvideServices';
import FeaturedRestaurants from '../../components/FeaturedRestaurants/FeaturedRestaurants';
import { Tag, Copy, Check, Sparkles, ShieldCheck, Truck, Headphones, Award } from 'lucide-react';

const VOUCHERS = [
  { code: 'WELCOME50', discount: '50% OFF', desc: 'Up to $15 on first order', min: 'Min $20 order' },
  { code: 'FREEDEL', discount: 'FREE DELIVERY', desc: 'Zero delivery fee anywhere in town', min: 'Min $25 order' },
  { code: 'CHEF20', discount: '20% OFF', desc: 'On all Chef Signature specials', min: 'No minimum' },
];

const Home = () => {
  const [category, setCategory] = useState('All');
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="home-page-container">
      {/* 1. Modern Split Hero Section */}
      <Header onSelectCategory={setCategory} />

      {/* 2. Compact Promotional Coupons Strip */}
      <section className="home-promo-strip-section" aria-label="Special Offers">
        <div className="home-section-inner">
          <div className="promo-strip-header">
            <div className="promo-strip-badge">
              <Sparkles size={15} />
              <span>Limited Time Promotions</span>
            </div>
            <span className="promo-strip-sub">Click any coupon code to copy instantly</span>
          </div>

          <div className="promo-vouchers-grid">
            {VOUCHERS.map((v) => (
              <div
                key={v.code}
                className={`voucher-ticket-card ${copiedCode === v.code ? 'copied' : ''}`}
                onClick={() => handleCopyCode(v.code)}
                role="button"
                tabIndex={0}
                aria-label={`Copy voucher code ${v.code}`}
              >
                <div className="ticket-left">
                  <span className="ticket-discount">{v.discount}</span>
                  <span className="ticket-desc">{v.desc}</span>
                  <span className="ticket-min">{v.min}</span>
                </div>
                <div className="ticket-divider">
                  <span className="ticket-notch notch-top"></span>
                  <span className="ticket-dashed-line"></span>
                  <span className="ticket-notch notch-bottom"></span>
                </div>
                <div className="ticket-right">
                  <span className="ticket-code-label">COUPON</span>
                  <span className="ticket-code">{v.code}</span>
                  <span className="ticket-copy-action">
                    {copiedCode === v.code ? (
                      <>
                        <Check size={14} className="text-success" />
                        <span className="text-success font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Services (Order Online, Dine-In, Live Events) */}
      <section className="home-section" id="services">
        <div className="home-section-inner">
          <ProvideServices />
        </div>
      </section>

      {/* 4. Trending Partner Restaurants Showcase */}
      <section className="home-section bg-surface-alt" id="restaurants">
        <div className="home-section-inner">
          <FeaturedRestaurants />
        </div>
      </section>

      {/* 5. "What are you craving today?" Cuisines Browser */}
      <section className="home-section" id="explore-menu">
        <div className="home-section-inner">
          <ExploreMenu category={category} setCategory={setCategory} />
        </div>
      </section>

      {/* 6. Curated Top Dishes (Dietary Filters, Auto-fill Grid) */}
      <section className="home-section bg-surface-alt">
        <div className="home-section-inner">
          <FoodDisplay category={category} />
        </div>
      </section>

      {/* 7. Curated Dining Collections */}
      <section className="home-section" id="collections">
        <div className="home-section-inner">
          <Collections />
        </div>
      </section>

      {/* 8. Trust & Quality Guarantee Banner */}
      <section className="home-trust-banner-section">
        <div className="home-section-inner">
          <div className="trust-pillars-grid">
            <div className="trust-pillar-card">
              <div className="trust-icon-box bg-orange-soft">
                <Truck size={24} className="text-orange" />
              </div>
              <h4>Express 25-Min Delivery</h4>
              <p>Hot, insulated delivery bags with live turn-by-turn courier tracking.</p>
            </div>

            <div className="trust-pillar-card">
              <div className="trust-icon-box bg-green-soft">
                <ShieldCheck size={24} className="text-green" />
              </div>
              <h4>100% Quality Guarantee</h4>
              <p>Prepared fresh to order. If something isn't right, we refund instantly.</p>
            </div>

            <div className="trust-pillar-card">
              <div className="trust-icon-box bg-blue-soft">
                <Headphones size={24} className="text-blue" />
              </div>
              <h4>24/7 Dedicated Support</h4>
              <p>Instant human chat concierge for special requests or dietary guidance.</p>
            </div>

            <div className="trust-pillar-card">
              <div className="trust-icon-box bg-purple-soft">
                <Award size={24} className="text-purple" />
              </div>
              <h4>Verified Top Kitchens</h4>
              <p>Every restaurant is hygiene certified and scored above 4.5 by customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Mobile App Showcase */}
      <section className="home-section">
        <div className="home-section-inner">
          <AppDownload />
        </div>
      </section>
    </div>
  );
};

export default Home;
