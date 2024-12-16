import React from 'react';
import './ProvideServices.css';
import { Link } from 'react-router-dom';
import { provideService } from '../../assets/assets';

const ProvideServices = () => {
  return (
    <>
      <h1 className="services-heading">Our Featured Services</h1>
      <p className="services-intro">
        Discover a wide range of services designed to meet your unique needs. Each service is crafted with attention to detail and delivers exceptional value, ensuring you get the best experience possible.
      </p>
      <div className="services-container">
        <div className="services-cards-wrapper">
          {provideService.map((service) => (
            <div className="service-card" key={service._id}>
              <img
                src={service.image}
                alt={service.serviceName}
                className="service-image"
              />
              {/* Generate a dynamic URL based on service name */}
              <Link
                to={`/feature/${service.serviceName
                  .toLowerCase()
                  .replace(/ /g, '-')}`}
                className="service-link"
              >
                <h1 className="service-title">{service.serviceName}</h1>
              </Link>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProvideServices;
