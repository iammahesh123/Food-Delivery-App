import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Search,
  Plus,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import { getLiveEventsApi } from '../../../apiService/api';
import './AdminEvents.css';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    venueName: '',
    eventDate: '',
    eventTime: '19:00',
    category: 'CONCERT',
    basePrice: 49,
    capacity: 250,
    featured: true,
    bannerUrl: ''
  });

  const fetchEvents = async () => {
    setLoading(true);
    const data = await getLiveEventsApi();
    setEvents(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    const created = {
      id: Date.now(),
      title: newEvent.title,
      venueName: newEvent.venueName || 'Downtown Arena',
      eventDate: newEvent.eventDate || '2026-10-15',
      eventTime: newEvent.eventTime || '19:00',
      category: newEvent.category,
      basePrice: Number(newEvent.basePrice) || 49,
      capacity: Number(newEvent.capacity) || 300,
      ticketsSold: 0,
      featured: newEvent.featured,
      bannerUrl: newEvent.bannerUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'
    };

    setEvents([created, ...events]);
    setShowAddModal(false);
    setNewEvent({
      title: '',
      venueName: '',
      eventDate: '',
      eventTime: '19:00',
      category: 'CONCERT',
      basePrice: 49,
      capacity: 250,
      featured: true,
      bannerUrl: ''
    });
  };

  const handleToggleFeatured = (id) => {
    setEvents(
      events.map((e) => (e.id === id ? { ...e, featured: !e.featured } : e))
    );
  };

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.venueName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-events-page">
      <div className="admin-page-header">
        <div>
          <div className="admin-pre-title">ENTERTAINMENT & NIGHTLIFE</div>
          <h1 className="admin-main-heading">Live Events & Pass Inventory</h1>
          <p className="admin-sub-heading">
            Publish platform-sponsored food carnivals, acoustic sessions, chef masterclasses, and manage ticketing.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-btn"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} />
          <span>Publish Live Event</span>
        </button>
      </div>

      <div className="admin-filter-toolbar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search events by title or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Event Showcase</th>
              <th>Category & Date</th>
              <th>Venue</th>
              <th>Pricing & Sales</th>
              <th>Capacity Utilization</th>
              <th>Featured</th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-table-cell">
                  No live events found.
                </td>
              </tr>
            ) : (
              filtered.map((evt) => {
                const sold = evt.ticketsSold || 42;
                const cap = evt.capacity || 200;
                const percent = Math.min(100, Math.round((sold / cap) * 100));

                return (
                  <tr key={evt.id}>
                    <td>
                      <div className="event-cell-info">
                        <img
                          src={evt.bannerUrl}
                          alt={evt.title}
                          className="evt-thumb-img"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800';
                          }}
                        />
                        <div>
                          <span className="evt-title-text">{evt.title}</span>
                          <span className="evt-id-text">EVT-#{evt.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="evt-date-stack">
                        <span className="evt-cat-badge">{evt.category}</span>
                        <span className="evt-date-text">{evt.eventDate} • {evt.eventTime}</span>
                      </div>
                    </td>

                    <td>
                      <span className="evt-venue-text">
                        <MapPin size={12} /> {evt.venueName}
                      </span>
                    </td>

                    <td>
                      <div className="evt-sales-stack">
                        <span className="evt-price-text">${evt.basePrice} base</span>
                        <span className="evt-rev-text">${(sold * evt.basePrice).toLocaleString()} revenue</span>
                      </div>
                    </td>

                    <td>
                      <div className="capacity-bar-wrap">
                        <div className="capacity-labels">
                          <span>{sold} / {cap} tickets</span>
                          <strong>{percent}%</strong>
                        </div>
                        <div className="mini-progress-track">
                          <div
                            className="mini-progress-fill bg-orange"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(evt.id)}
                        className={`featured-toggle-btn ${evt.featured ? 'featured' : ''}`}
                      >
                        <Sparkles size={12} />
                        <span>{evt.featured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>

                    <td className="td-actions">
                      <button
                        type="button"
                        className="table-action-icon-btn delete"
                        onClick={() => {
                          if (window.confirm(`Delete event ${evt.title}?`)) {
                            setEvents(events.filter((item) => item.id !== evt.id));
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Publish Event Modal */}
      {showAddModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Publish Live Event</h3>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="modal-form-content">
              <div className="form-group">
                <label>Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Neon Rooftop Jazz Festival 2026"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Venue Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="The Grand Rooftop Terrace"
                    value={newEvent.venueName}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, venueName: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, category: e.target.value })
                    }
                    className="role-modal-select"
                  >
                    <option value="CONCERT">Live Concert</option>
                    <option value="FOOD_FESTIVAL">Food Festival</option>
                    <option value="STANDUP_COMEDY">Standup Comedy</option>
                    <option value="CHEF_TABLE">Chef's Table Experience</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Event Date</label>
                  <input
                    type="date"
                    value={newEvent.eventDate}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, eventDate: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={newEvent.eventTime}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, eventTime: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Base Ticket Price ($)</label>
                  <input
                    type="number"
                    min="5"
                    value={newEvent.basePrice}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, totalPrice: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Max Pass Capacity</label>
                  <input
                    type="number"
                    min="10"
                    value={newEvent.capacity}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, capacity: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Banner Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newEvent.bannerUrl}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, bannerUrl: e.target.value })
                  }
                />
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
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
