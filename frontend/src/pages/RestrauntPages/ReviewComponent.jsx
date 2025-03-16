import React from 'react';
import './ReviewComponent.css';

const ReviewComponent = ({ reviews }) => {
  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>
          {i <= rating ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="review-component">
      <h2>Customer Reviews</h2>
      <div className="reviews-list">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="review-header">
              <h3>{review.author}</h3>
              <div className="review-rating">
                {renderStars(review.rating)}
                <span className="rating-value">{review.rating}</span>
              </div>
            </div>
            <p className="review-text">{review.text}</p>
            <p className="review-date">{review.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewComponent;