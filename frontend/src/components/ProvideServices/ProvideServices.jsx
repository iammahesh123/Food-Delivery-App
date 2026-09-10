import React from 'react';
import './ProvideServices.css';
import { Link } from 'react-router-dom';
import { provideService } from '../../assets/assets';
import { Sparkles, ArrowRight, Zap, Utensils, Calendar } from 'lucide-react';

const SERVICE_META = {
  '1': { icon: Zap, tag: '⚡ 25 Min Delivery', badgeBg: 'badge-orange', action: 'Order Online' },
  '2': { icon: Utensils, tag: '⭐ Priority Table', badgeBg: 'badge-blue', action: 'Reserve Dine-In' },
  '3': { icon: Calendar, tag: '🎟️ Live Shows & Gigs', badgeBg: 'badge-purple', action: 'Explore Events' },
};

const ProvideServices = () => {
  return (
    <div className="services-section">
      <div className="services-header-row">
        <div>
          <div className="services-eyebrow">
            <Sparkles size={15} className="text-orange" />
            <span>Multi-Channel Services</span>
          </div>
          <h2 className="services-main-title">Tailored Culinary Experiences</h2>
          <p className="services-intro">
            From lightning-fast doorstep delivery to table bookings and live events & concerts, we've got your experiences covered.
          </p>
        </div>
      </div>

      <div className="services-grid">
        {provideService.map((service) => {
          const meta = SERVICE_META[service._id] || {
            icon: Zap,
            tag: 'Featured Service',
            badgeBg: 'badge-orange',
            action: 'Learn More',
          };
          const Icon = meta.icon;
          const targetUrl = 
            service._id === '1' ? '/explore-menu' : 
            service._id === '2' ? '/dining' : 
            service._id === '3' ? '/events' : 
            `/feature/${service.serviceName.toLowerCase().replace(/ /g, '-')}`;

          return (
            <Link
              to={targetUrl}
              key={service._id}
              className="service-card"
            >
              <div className="service-image-container">
                <img
                  src={service.image}
                  alt={service.serviceName}
                  className="service-image"
                />
                <span className={`service-tag-pill ${meta.badgeBg}`}>
                  {meta.tag}
                </span>
              </div>

              <div className="service-content-box">
                <div className="service-header-row">
                  <h3 className="service-title">{service.serviceName}</h3>
                  <div className="service-icon-circle">
                    <Icon size={18} />
                  </div>
                </div>

                <p className="service-description">{service.description}</p>

                <div className="service-action-row">
                  <span className="action-text">{meta.action}</span>
                  <ArrowRight size={15} className="action-arrow" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProvideServices;
