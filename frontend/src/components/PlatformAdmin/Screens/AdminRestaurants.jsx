import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  Edit2,
  Trash2,
  ExternalLink,
  DollarSign,
  Utensils,
  Phone,
  Mail,
  MapPin,
  X
} from 'lucide-react';
import {
  getPlatformRestaurantsApi,
  updateRestaurantStatusApi,
  updateRestaurantCommissionApi
} from '../../../apiService/api';
import './AdminRestaurants.css';

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'PENDING_REVIEW' | 'SUSPENDED'

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    address: '',
    phone: '',
    ownerName: '',
    ownerEmail: '',
    commissionPercentage: 15,
    imageUrl: ''
  });

  const defaultRestaurants = [
    {
      id: 1,
      restaurantName: "The Olive Gardenia",
      address: "450 Lexington Ave, Midtown East",
      phone: "+1 (555) 234-5678",
      rating: 4.8,
      ownerName: "Marco Rossi",
      ownerEmail: "marco@olivegardenia.com",
      totalMenuDishes: 24,
      totalOrders: 642,
      totalRevenue: 28450.00,
      commissionPercentage: 15.0,
      status: "ACTIVE",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
    },
    {
      id: 2,
      restaurantName: "Artisan Truffle Pizza & Grill",
      address: "128 SoHo Broadway, Downtown",
      phone: "+1 (555) 987-6543",
      rating: 4.9,
      ownerName: "Antonio Bellini",
      ownerEmail: "antonio@bellini.pizza",
      totalMenuDishes: 18,
      totalOrders: 890,
      totalRevenue: 42100.00,
      commissionPercentage: 15.0,
      status: "ACTIVE",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800"
    },
    {
      id: 3,
      restaurantName: "Kyoto Omakase & Robata",
      address: "742 5th Avenue, Uptown",
      phone: "+1 (555) 345-6789",
      rating: 4.7,
      ownerName: "Kenji Sato",
      ownerEmail: "kenji@kyoto-omakase.com",
      totalMenuDishes: 32,
      totalOrders: 310,
      totalRevenue: 34500.00,
      commissionPercentage: 18.0,
      status: "ACTIVE",
      imageUrl: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800"
    },
    {
      id: 4,
      restaurantName: "Taco Libre Cantina",
      address: "88 Chelsea Market Way",
      phone: "+1 (555) 876-5432",
      rating: 4.5,
      ownerName: "Elena Gomez",
      ownerEmail: "elena@tacolibre.com",
      totalMenuDishes: 15,
      totalOrders: 420,
      totalRevenue: 15800.00,
      commissionPercentage: 12.0,
      status: "PENDING_REVIEW",
      imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800"
    },
    {
      id: 5,
      restaurantName: "Golden Dragon Dumpling House",
      address: "19 Chinatown Arcade",
      phone: "+1 (555) 432-1098",
      rating: 4.2,
      ownerName: "David Chen",
      ownerEmail: "david@goldendragon.com",
      totalMenuDishes: 40,
      totalOrders: 180,
      totalRevenue: 8900.00,
      commissionPercentage: 15.0,
      status: "SUSPENDED",
      imageUrl: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800"
    }
  ];

  const fetchRestaurants = async () => {
    setLoading(true);
    const data = await getPlatformRestaurantsApi();
    if (data && Array.isArray(data) && data.length > 0) {
      setRestaurants(data);
    } else {
      setRestaurants(defaultRestaurants);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await updateRestaurantStatusApi(id, newStatus);
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleCommissionChange = async (id, newCommission) => {
    const val = parseFloat(newCommission);
    if (isNaN(val)) return;
    await updateRestaurantCommissionApi(id, val);
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, commissionPercentage: val } : r))
    );
  };

  const handleCreateRestaurant = (e) => {
    e.preventDefault();
    if (!newRestaurant.name.trim()) return;

    const created = {
      id: Date.now(),
      restaurantName: newRestaurant.name,
      address: newRestaurant.address || 'Central District',
      phone: newRestaurant.phone || '+1 (555) 000-0000',
      rating: 5.0,
      ownerName: newRestaurant.ownerName || 'Merchant Partner',
      ownerEmail: newRestaurant.ownerEmail || 'merchant@tomato.food',
      totalMenuDishes: 0,
      totalOrders: 0,
      totalRevenue: 0,
      commissionPercentage: Number(newRestaurant.commissionPercentage) || 15,
      status: 'ACTIVE',
      imageUrl: newRestaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
    };

    setRestaurants([created, ...restaurants]);
    setShowAddModal(false);
    setNewRestaurant({
      name: '',
      address: '',
      phone: '',
      ownerName: '',
      ownerEmail: '',
      commissionPercentage: 15,
      imageUrl: ''
    });
  };

  const filteredRestaurants = (restaurants.length > 0 ? restaurants : defaultRestaurants).filter((r) => {
    const name = r.restaurantName || '';
    const addr = r.address || '';
    const owner = r.ownerName || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || (r.status || 'ACTIVE') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-restaurants-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-pre-title">MERCHANT PARTNERS DIRECTORY</div>
          <h1 className="admin-main-heading">Restaurant & Kitchen Management</h1>
          <p className="admin-sub-heading">
            Onboard, review verification requests, adjust commission rates, and audit merchant compliance.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-btn"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} />
          <span>Onboard New Restaurant</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-toolbar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by restaurant name, address, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-filter-pills">
          {[
            { id: 'ALL', label: 'All Partners' },
            { id: 'ACTIVE', label: 'Active' },
            { id: 'PENDING_REVIEW', label: 'Pending Review' },
            { id: 'SUSPENDED', label: 'Suspended' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`filter-pill ${statusFilter === tab.id ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurants Table */}
      <div className="admin-table-container">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Restaurant & Location</th>
              <th>Owner & Contact</th>
              <th>Rating & Dishes</th>
              <th>Orders & GMV</th>
              <th>Commission %</th>
              <th>Status</th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRestaurants.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-table-cell">
                  No restaurant partners found matching the filter criteria.
                </td>
              </tr>
            ) : (
              filteredRestaurants.map((res) => (
                <tr key={res.id}>
                  <td>
                    <div className="restaurant-cell-info">
                      <img
                        src={res.imageUrl}
                        alt={res.restaurantName}
                        className="res-thumb-img"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800';
                        }}
                      />
                      <div>
                        <span className="res-name-text">{res.restaurantName}</span>
                        <span className="res-address-text">
                          <MapPin size={12} /> {res.address}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="res-owner-details">
                      <span className="owner-name-val">{res.ownerName}</span>
                      <span className="owner-email-val">{res.ownerEmail}</span>
                    </div>
                  </td>

                  <td>
                    <div className="res-performance-metrics">
                      <span className="res-rating-badge">
                        <Star size={12} fill="#ea580c" color="#ea580c" /> {res.rating}
                      </span>
                      <span className="dishes-count-label">{res.totalMenuDishes} menu dishes</span>
                    </div>
                  </td>

                  <td>
                    <div className="res-orders-volume">
                      <span className="res-orders-num">{res.totalOrders} orders</span>
                      <span className="res-gmv-num">${res.totalRevenue?.toLocaleString()}</span>
                    </div>
                  </td>

                  <td>
                    <div className="commission-input-box">
                      <input
                        type="number"
                        defaultValue={res.commissionPercentage}
                        onBlur={(e) => handleCommissionChange(res.id, e.target.value)}
                        className="commission-field"
                        min="0"
                        max="50"
                        step="0.5"
                      />
                      <span>%</span>
                    </div>
                  </td>

                  <td>
                    <select
                      value={res.status}
                      onChange={(e) => handleStatusChange(res.id, e.target.value)}
                      className={`status-select-badge status-${res.status.toLowerCase()}`}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="PENDING_REVIEW">PENDING</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                    </select>
                  </td>

                  <td className="td-actions">
                    <button
                      type="button"
                      className="table-action-icon-btn delete"
                      title="Remove Restaurant"
                      onClick={() => {
                        if (window.confirm(`Delete ${res.restaurantName}?`)) {
                          setRestaurants(restaurants.filter((r) => r.id !== res.id));
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Onboard Restaurant Modal */}
      {showAddModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Onboard New Restaurant Partner</h3>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRestaurant} className="modal-form-content">
              <div className="form-group">
                <label>Restaurant Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saffron Bistro & Lounge"
                  value={newRestaurant.name}
                  onChange={(e) =>
                    setNewRestaurant({ ...newRestaurant, name: e.target.value })
                  }
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    placeholder="120 Lexington Ave, NY"
                    value={newRestaurant.address}
                    onChange={(e) =>
                      setNewRestaurant({ ...newRestaurant, address: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 432-8900"
                    value={newRestaurant.phone}
                    onChange={(e) =>
                      setNewRestaurant({ ...newRestaurant, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Owner Full Name</label>
                  <input
                    type="text"
                    placeholder="Chef / Owner Name"
                    value={newRestaurant.ownerName}
                    onChange={(e) =>
                      setNewRestaurant({ ...newRestaurant, ownerName: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Owner Email</label>
                  <input
                    type="email"
                    placeholder="owner@restaurant.com"
                    value={newRestaurant.ownerEmail}
                    onChange={(e) =>
                      setNewRestaurant({ ...newRestaurant, ownerEmail: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Platform Commission (%)</label>
                  <input
                    type="number"
                    min="5"
                    max="40"
                    value={newRestaurant.commissionPercentage}
                    onChange={(e) =>
                      setNewRestaurant({
                        ...newRestaurant,
                        commissionPercentage: e.target.value
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Banner Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newRestaurant.imageUrl}
                    onChange={(e) =>
                      setNewRestaurant({ ...newRestaurant, imageUrl: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn">
                  Onboard Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRestaurants;
