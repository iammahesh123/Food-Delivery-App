import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import Overview from './RestaurantOveriew';
import OnlineOrder from './OnlineOrder';
import ReviewComponent from './ReviewComponent';
import BookTable from './BookTable';
import { Star, Clock, MapPin, ArrowLeft, Utensils, CalendarCheck, Image, MessageSquare } from 'lucide-react';
import './RestaurantPage.css';

const DEFAULT_RESTAURANT = {
  id: '1',
  name: 'Delicious Bites',
  rating: 4.5,
  deliveryRating: 4.2,
  type: 'Italian, Artisanal Pizza, Fresh Pasta & Desserts',
  address: '123 Main Street, New York, NY',
  openingTimes: '10:00 AM - 10:00 PM',
  images: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
  ],
  overview: 'An authentic culinary sanctuary crafting handmade pasta, sourdough wood-fired pizzas, and heritage Italian desserts.',
  offers: ['10% off with coupon code SAVE10', 'Free delivery on orders over $50'],
  menus: ['Lunch Menu', 'Dinner Menu', 'Dessert Menu'],
  menuItems: {
    'Lunch Menu': [
      {
        id: 'm1',
        name: 'Margherita Pizza',
        image: 'https://images.unsplash.com/photo-1564936281291-294551497d81?q=80&w=600&auto=format&fit=crop',
        description: 'San Marzano tomatoes, fresh buffalo mozzarella, virgin olive oil, and organic basil.',
        rating: 4.7,
        price: 14,
      },
      {
        id: 'm2',
        name: 'Caesar Salad',
        image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=600&auto=format&fit=crop',
        description: 'Crisp romaine heart leaves, aged parmesan shavings, herb croutons, and house garlic emulsion.',
        rating: 4.5,
        price: 10,
      },
      {
        id: 'm3',
        name: 'Pasta Carbonara',
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=600&auto=format&fit=crop',
        description: 'Handmade spaghetti, crispy cured pancetta, free-range egg yolk, and pecorino romano.',
        rating: 4.8,
        price: 16,
      },
    ],
    'Dinner Menu': [
      {
        id: 'm4',
        name: 'Grilled Salmon',
        image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=600&auto=format&fit=crop',
        description: 'Wild Atlantic salmon fillet seared with dill butter and served over asparagus.',
        rating: 4.8,
        price: 22,
      },
      {
        id: 'm5',
        name: 'Steak Frites',
        image: 'https://images.unsplash.com/photo-1504973960431-1c467e159aa4?q=80&w=600&auto=format&fit=crop',
        description: 'Prime cut ribeye with truffle herb butter and hand-cut golden fries.',
        rating: 4.9,
        price: 28,
      },
      {
        id: 'm6',
        name: 'Vegetable Lasagna',
        image: 'https://images.unsplash.com/photo-1666599207792-d25938831199?q=80&w=600&auto=format&fit=crop',
        description: 'Slow-baked layers of roasted zucchini, bell peppers, ricotta, and marinara.',
        rating: 4.6,
        price: 15,
      },
    ],
    'Dessert Menu': [
      {
        id: 'm7',
        name: 'Traditional Tiramisu',
        image: 'https://plus.unsplash.com/premium_photo-1695028377770-6cc9d957e1e4?q=80&w=600&auto=format&fit=crop',
        description: 'Espresso-soaked savoiardi biscuits layered with mascarpone and rich cocoa.',
        rating: 4.9,
        price: 8,
      },
      {
        id: 'm8',
        name: 'Chocolate Lava Cake',
        image: 'https://plus.unsplash.com/premium_photo-1716152282009-3ee413548e46?q=80&w=600&auto=format&fit=crop',
        description: 'Warm dark chocolate sponge with a molten Belgian chocolate center.',
        rating: 4.8,
        price: 9,
      },
    ],
  },
  averageCost: '$35 for two',
  famousFoods: ['Margherita Pizza', 'Pasta Carbonara', 'Traditional Tiramisu'],
  reviews: [
    {
      author: 'Sophia Martinez',
      rating: 5,
      text: 'The Margherita pizza crust had the perfect char and airy texture. Fast delivery and food arrived steaming hot!',
      date: '2 days ago',
    },
    {
      author: 'Jonathan Reed',
      rating: 4.5,
      text: 'Pasta carbonara was creamy and balanced without being heavy. Will definitely make this our Friday go-to.',
      date: '1 week ago',
    },
  ],
  photos: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop',
  ],
  faq: [
    { question: 'Do you offer vegan or gluten-free pasta?', answer: 'Yes, we offer certified gluten-free penne and vegan almond-based mozzarella.' },
    { question: 'Are table reservations required on weekends?', answer: 'We strongly recommend booking 24 hours in advance for Friday and Saturday dinners.' },
  ],
};

const RestaurantPage = () => {
  const { id } = useParams();
  const { restaurants_data } = useContext(StoreContext);
  const [activeTab, setActiveTab] = useState('orderonline');

  // Match restaurant from context or fallback to rich default
  const matched = restaurants_data.find((r) => String(r.id) === String(id));
  const restaurant = matched
    ? { ...DEFAULT_RESTAURANT, ...matched, menuItems: DEFAULT_RESTAURANT.menuItems }
    : DEFAULT_RESTAURANT;

  return (
    <div className="restaurant-page fade-in">
      {/* Back Link */}
      <div className="restaurant-breadcrumbs">
        <Link to="/restaurants" className="res-back-link">
          <ArrowLeft size={16} /> Back to Restaurants
        </Link>
      </div>

      {/* Restaurant Header */}
      <div className="restaurant-header">
        <div className="header-left">
          <h1 className="res-name">{restaurant.name}</h1>
          <p className="restaurant-type">{restaurant.type}</p>
          <div className="res-meta-line">
            <span className="meta-item"><MapPin size={14} className="icon" /> {restaurant.address}</span>
            <span className="meta-dot">•</span>
            <span className="meta-item"><Clock size={14} className="icon" /> {restaurant.openingTimes}</span>
          </div>
        </div>

        <div className="header-right">
          <div className="rating-pill-card">
            <span className="rating-num"><Star size={14} fill="currentColor" /> {restaurant.rating}</span>
            <span className="rating-desc">Dining (420+ reviews)</span>
          </div>
          <div className="rating-pill-card delivery">
            <span className="rating-num"><Star size={14} fill="currentColor" /> {restaurant.deliveryRating}</span>
            <span className="rating-desc">Delivery (1.2k+ ratings)</span>
          </div>
        </div>
      </div>

      {/* Hero Photo Gallery */}
      <div className="restaurant-images-gallery">
        {restaurant.images.map((img, idx) => (
          <img key={idx} src={img} alt={`${restaurant.name} interior ${idx + 1}`} className="gallery-photo" />
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation" role="tablist">
        {[
          { key: 'orderonline', label: 'Order Online', icon: Utensils },
          { key: 'booktable', label: 'Book a Table', icon: CalendarCheck },
          { key: 'overview', label: 'Overview', icon: Clock },
          { key: 'reviews', label: 'Reviews', icon: MessageSquare },
          { key: 'photos', label: 'Photos', icon: Image },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={activeTab === t.key}
              className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="restaurant-tab-content">
        {activeTab === 'orderonline' && <OnlineOrder restaurant={restaurant} />}
        {activeTab === 'booktable' && <BookTable restaurant={restaurant} />}
        {activeTab === 'overview' && <Overview restaurant={restaurant} />}
        {activeTab === 'reviews' && <ReviewComponent reviews={restaurant.reviews} />}
        {activeTab === 'photos' && (
          <div className="photos-grid">
            {restaurant.photos.map((photo, index) => (
              <div key={index} className="photo-card">
                <img src={photo} alt={`Restaurant photo ${index + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          {restaurant.faq.map((item, index) => (
            <div key={index} className="faq-item">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;