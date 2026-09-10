import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  UtensilsCrossed, 
  ArrowRight, 
  ArrowUp, 
  CheckCircle2,
  Calendar,
  Ticket,
  Store,
  ChefHat,
  Send,
  Heart
} from 'lucide-react';
import { assets } from '../../assets/assets';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 6000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-main" id="footer">
      {/* Top Value / Trust Highlights Strip */}
      <div className="footer-trust-strip">
        <div className="trust-strip-container">
          <div className="trust-item">
            <div className="trust-icon-box">
              <Truck size={22} />
            </div>
            <div className="trust-item-text">
              <h4>Lightning Delivery</h4>
              <p>Hot gourmet dishes at your doorstep in 30 mins</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <ShieldCheck size={22} />
            </div>
            <div className="trust-item-text">
              <h4>100% Quality Guarantee</h4>
              <p>Strict kitchen hygiene & temperature-controlled delivery</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <UtensilsCrossed size={22} />
            </div>
            <div className="trust-item-text">
              <h4>Premier Dining Out</h4>
              <p>Instant table reservations & up to 50% dining discounts</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <Sparkles size={22} />
            </div>
            <div className="trust-item-text">
              <h4>Live Food Festivals</h4>
              <p>Exclusive tickets to concert dinners & tasting galas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="footer-body-wrapper">
        <div className="footer-main-grid">
          {/* Col 1: Brand & App Download */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-brand-link" onClick={scrollToTop}>
              <img src={assets.logo2} alt="Tomato Logo" className="footer-logo-img" />
            </Link>
            <p className="brand-description">
              Tomato delivers the city's finest dining, artisanal kitchens, and sensational live entertainment straight to food lovers with uncompromised hospitality.
            </p>

            <div className="live-status-badge">
              <span className="live-dot" />
              <span>Kitchens Live • Delivering Across City</span>
            </div>

            <div className="app-download-wrap">
              <span className="download-label">Download the Mobile App</span>
              <div className="app-badges">
                <a href="#app-store" className="store-badge-link" title="Download on App Store">
                  <img src={assets.app_store} alt="App Store" />
                </a>
                <a href="#play-store" className="store-badge-link" title="Get it on Google Play">
                  <img src={assets.play_store} alt="Google Play" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Discover Experiences */}
          <div className="footer-col">
            <h3 className="col-heading">
              <UtensilsCrossed size={16} className="heading-icon" /> Discover
            </h3>
            <ul className="footer-links-list">
              <li><Link to="/explore-menu" onClick={scrollToTop}>Explore Full Menu</Link></li>
              <li>
                <Link to="/dining" onClick={scrollToTop}>
                  Gourmet Dining Out <span className="mini-badge-tag hot">HOT</span>
                </Link>
              </li>
              <li>
                <Link to="/events" onClick={scrollToTop}>
                  Live Concerts & Festivals <span className="mini-badge-tag live">LIVE</span>
                </Link>
              </li>
              <li><Link to="/restaurants" onClick={scrollToTop}>Partner Restaurants</Link></li>
              <li><Link to="/collections" onClick={scrollToTop}>Curated Collections</Link></li>
              <li><Link to="/featureservices" onClick={scrollToTop}>Party Catering & Services</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Account */}
          <div className="footer-col">
            <h3 className="col-heading">
              <Calendar size={16} className="heading-icon" /> My Account
            </h3>
            <ul className="footer-links-list">
              <li><Link to="/my-orders" onClick={scrollToTop}>Track Live Orders</Link></li>
              <li><Link to="/my-dining" onClick={scrollToTop}>My Table Bookings</Link></li>
              <li><Link to="/my-tickets" onClick={scrollToTop}>Digital Event Passes</Link></li>
              <li><Link to="/cart" onClick={scrollToTop}>View Active Cart</Link></li>
              <li><Link to="/contact-us" onClick={scrollToTop}>Help Center & FAQs</Link></li>
              <li><Link to="/contact-us" onClick={scrollToTop}>Report an Issue</Link></li>
            </ul>
          </div>

          {/* Col 4: For Partners & Kitchens */}
          <div className="footer-col">
            <h3 className="col-heading">
              <Store size={16} className="heading-icon" /> For Partners
            </h3>
            <ul className="footer-links-list">
              <li>
                <Link to="/dashboard" onClick={scrollToTop}>
                  Merchant Hub Portal <span className="mini-badge-tag pro">PRO</span>
                </Link>
              </li>
              <li><Link to="/dashboard/live-orders" onClick={scrollToTop}>Kitchen Order Dispatch</Link></li>
              <li><Link to="/dashboard/dining" onClick={scrollToTop}>Restaurant Floor Manager</Link></li>
              <li><Link to="/dashboard/events" onClick={scrollToTop}>Gate Pass Scanner</Link></li>
              <li><Link to="/contact-us" onClick={scrollToTop}>Add Your Restaurant</Link></li>
              <li><Link to="/contact-us" onClick={scrollToTop}>Delivery Partner Careers</Link></li>
            </ul>
          </div>

          {/* Col 5: VIP Newsletter & Contact */}
          <div className="footer-col newsletter-col">
            <h3 className="col-heading">
              <Sparkles size={16} className="heading-icon" /> Tomato VIP Club
            </h3>
            <p className="newsletter-subtext">
              Join 50,000+ gourmets for secret weekend menu drops, chef collaborations, and 50% discount codes.
            </p>

            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="newsletter-input-box">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-submit-btn" aria-label="Subscribe">
                  <Send size={16} />
                </button>
              </div>
            </form>

            {subscribed && (
              <div className="newsletter-success-toast">
                <CheckCircle2 size={16} />
                <span>You're in! Check your inbox for your 50% coupon code.</span>
              </div>
            )}

            <div className="direct-contact-box">
              <div className="contact-line">
                <Phone size={15} className="contact-icon" />
                <a href="tel:+1800866286">+1 (800) 866-286</a>
                <span className="contact-tag">24/7 Live</span>
              </div>
              <div className="contact-line">
                <Mail size={15} className="contact-icon" />
                <a href="mailto:support@tomato.food">support@tomato.food</a>
              </div>
              <div className="contact-line">
                <MapPin size={15} className="contact-icon" />
                <span>450 Lexington Ave, New York, NY</span>
              </div>
            </div>

            <div className="footer-social-strip">
              <span className="social-label">Follow our food journeys:</span>
              <div className="social-icons-group">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-circle-link" title="Facebook">
                  <img src={assets.facebook_icon} alt="Facebook" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-circle-link" title="Twitter">
                  <img src={assets.twitter_icon} alt="Twitter" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-circle-link" title="LinkedIn">
                  <img src={assets.linkedin_icon} alt="LinkedIn" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-divider-line" />

        {/* Bottom Bar: Copyright & Legal & Back to Top */}
        <div className="footer-bottom-bar">
          <div className="bottom-left">
            <p className="copyright-text">
              &copy; {new Date().getFullYear()} Tomato Technologies Inc. Handcrafted with passion for food lovers.
            </p>
            <div className="legal-links">
              <Link to="/contact-us">Privacy Policy</Link>
              <span className="legal-dot">•</span>
              <Link to="/contact-us">Terms of Service</Link>
              <span className="legal-dot">•</span>
              <Link to="/contact-us">Cookie Settings</Link>
              <span className="legal-dot">•</span>
              <Link to="/contact-us">Security & Compliance</Link>
            </div>
          </div>

          <button 
            type="button" 
            className="back-to-top-btn" 
            onClick={scrollToTop}
            title="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
