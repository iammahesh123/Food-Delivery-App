import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bike, UtensilsCrossed, Sparkles, Clock, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import './FeatureServices.css';

const FeatureServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 'online-delivery',
      title: 'Direct Doorstep Delivery',
      subtitle: 'Instant Delivery in Under 30 Minutes',
      description: 'Order from over 500+ verified partner restaurants with real-time temperature tracking and contactless delivery straight to your doorstep.',
      icon: Bike,
      badge: 'Most Popular',
      actionText: 'Order Food Now',
      route: '/explore-menu',
    },
    {
      id: 'table-reservation',
      title: 'Priority Table Booking',
      subtitle: 'Zero Waiting Time at Top Venues',
      description: 'Reserve private dining booths, romantic patio tables, and family banquet spaces with instant confirmation and special anniversary discounts.',
      icon: UtensilsCrossed,
      badge: 'Instant Confirm',
      actionText: 'Browse Dining Venues',
      route: '/dining',
    },
    {
      id: 'catering-events',
      title: 'Corporate Catering & Live Events',
      subtitle: 'Bulk Culinary Solutions for Teams',
      description: 'Gourmet meal boxes, customized corporate event buffets, and private chef bookings for celebrations, festivals, and business summits.',
      icon: Sparkles,
      badge: 'Enterprise',
      actionText: 'Contact Catering Team',
      route: '/contact-us',
    },
  ];

  return (
    <div className="feature-services-page fade-in">
      <div className="services-hero">
        <span className="services-pill">Full-Service Culinary Solutions</span>
        <h1 className="services-title">Designed for Every Occasion</h1>
        <p className="services-subtitle">
          Whether you need a hot lunch at your work desk, a reserved booth for a milestone anniversary, or catering for 500 attendees, we have you covered.
        </p>
      </div>

      <div className="services-cards-grid">
        {services.map((svc) => {
          const Icon = svc.icon;
          return (
            <div key={svc.id} className="service-feature-card">
              <div className="card-top">
                <div className="icon-wrapper">
                  <Icon size={28} />
                </div>
                <span className="service-badge">{svc.badge}</span>
              </div>

              <h2 className="service-name">{svc.title}</h2>
              <h3 className="service-headline">{svc.subtitle}</h3>
              <p className="service-body">{svc.description}</p>

              <div className="service-card-footer">
                <Button
                  variant="primary"
                  rightIcon={<ArrowRight size={16} />}
                  onClick={() => navigate(svc.route)}
                >
                  {svc.actionText}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="services-trust-banner">
        <div className="trust-item">
          <Clock size={20} className="trust-icon" />
          <div>
            <h4>On-Time Guarantee</h4>
            <p>Late delivery refunds credited instantly</p>
          </div>
        </div>
        <div className="trust-item">
          <ShieldCheck size={20} className="trust-icon" />
          <div>
            <h4>100% Hygiene Audited</h4>
            <p>Quarterly FSSAI food safety inspections</p>
          </div>
        </div>
        <div className="trust-item">
          <HeartHandshake size={20} className="trust-icon" />
          <div>
            <h4>24/7 Priority Support</h4>
            <p>Dedicated customer happiness agents</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureServices;
