import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Mail,
  User,
  Trash2,
  X
} from 'lucide-react';
import {
  getPlatformUsersApi,
  updateUserRoleApi,
  toggleUserStatusApi
} from '../../../apiService/api';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: '',
    username: '',
    email: '',
    role: 'CUSTOMER'
  });

  const defaultUsers = [
    { id: 1, fullName: "Mahesh Kumar", username: "mahesh_admin", email: "mahesh@tomato.food", role: "ADMIN", active: true, createdAt: "2025-01-10T10:00:00", ordersCount: 14 },
    { id: 2, fullName: "Sarah Jenkins", username: "sjenkins", email: "sarah@gmail.com", role: "CUSTOMER", active: true, createdAt: "2025-02-14T14:30:00", ordersCount: 28 },
    { id: 3, fullName: "Marco Rossi", username: "marco_olive", email: "marco@olivegardenia.com", role: "RESTAURANT_OWNER", active: true, createdAt: "2025-01-20T11:15:00", ordersCount: 642 },
    { id: 4, fullName: "Vikram Singh", username: "vikram_driver", email: "vikram.delivery@tomato.food", role: "DELIVERY_PERSON", active: true, createdAt: "2025-03-01T09:00:00", ordersCount: 154 },
    { id: 5, fullName: "Elena Gomez", username: "elena_tacos", email: "elena@tacolibre.com", role: "RESTAURANT_OWNER", active: true, createdAt: "2025-03-04T16:20:00", ordersCount: 42 },
    { id: 6, fullName: "Robert Miller", username: "robert_m", email: "robert.m@yahoo.com", role: "CUSTOMER", active: false, createdAt: "2025-02-01T12:00:00", ordersCount: 2 }
  ];

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getPlatformUsersApi();
    if (data && Array.isArray(data) && data.length > 0) {
      setUsers(data);
    } else {
      setUsers(defaultUsers);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    await updateUserRoleApi(id, newRole);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  };

  const handleStatusToggle = async (id, currentActive) => {
    const updated = !currentActive;
    await toggleUserStatusApi(id, updated);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: updated } : u))
    );
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.fullName.trim() || !newUser.email.trim()) return;

    const created = {
      id: Date.now(),
      fullName: newUser.fullName,
      username: newUser.username || newUser.email.split('@')[0],
      email: newUser.email,
      role: newUser.role,
      active: true,
      createdAt: new Date().toISOString(),
      ordersCount: 0
    };

    setUsers([created, ...users]);
    setShowAddModal(false);
    setNewUser({ fullName: '', username: '', email: '', role: 'CUSTOMER' });
  };

  const filteredUsers = (users.length > 0 ? users : defaultUsers).filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const name = u.fullName || '';
    const email = u.email || '';
    const username = u.username || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      username.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="admin-users-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-pre-title">ACCESS & IDENTITY REGISTRY</div>
          <h1 className="admin-main-heading">User Management & Permissions</h1>
          <p className="admin-sub-heading">
            Manage platform accounts across customers, merchant operators, courier fleets, and administrators.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-btn"
          onClick={() => setShowAddModal(true)}
        >
          <UserPlus size={16} />
          <span>Provision New User</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-toolbar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search users by name, email, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-filter-pills">
          {[
            { id: 'ALL', label: 'All Roles' },
            { id: 'CUSTOMER', label: 'Customers' },
            { id: 'RESTAURANT_OWNER', label: 'Merchants' },
            { id: 'DELIVERY_PERSON', label: 'Delivery Fleet' },
            { id: 'ADMIN', label: 'Admins' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`filter-pill ${roleFilter === tab.id ? 'active' : ''}`}
              onClick={() => setRoleFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-table-container">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>User Profile</th>
              <th>Username & Email</th>
              <th>Assigned Role</th>
              <th>Account Status</th>
              <th>Activity Count</th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-table-cell">
                  No users found matching current filters.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="user-profile-cell">
                      <div className={`user-avatar-circle role-${u.role?.toLowerCase()}`}>
                        {u.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <span className="user-full-name">{u.fullName}</span>
                        <span className="user-join-date">ID: #{u.id}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="user-email-stack">
                      <span className="user-username">@{u.username}</span>
                      <span className="user-email">{u.email}</span>
                    </div>
                  </td>

                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className={`role-select-pill role-pill-${u.role?.toLowerCase()}`}
                    >
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="RESTAURANT_OWNER">MERCHANT</option>
                      <option value="DELIVERY_PERSON">DELIVERY COURIER</option>
                      <option value="ADMIN">PLATFORM ADMIN</option>
                    </select>
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(u.id, u.active)}
                      className={`user-status-toggle-btn ${u.active ? 'active' : 'suspended'}`}
                    >
                      {u.active ? (
                        <>
                          <CheckCircle2 size={13} />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={13} />
                          <span>Suspended</span>
                        </>
                      )}
                    </button>
                  </td>

                  <td>
                    <span className="orders-count-badge">
                      {u.ordersCount || 0} Orders
                    </span>
                  </td>

                  <td className="td-actions">
                    <button
                      type="button"
                      className="table-action-icon-btn delete"
                      title="Remove User"
                      onClick={() => {
                        if (window.confirm(`Delete user ${u.fullName}?`)) {
                          setUsers(users.filter((item) => item.id !== u.id));
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

      {/* Provision User Modal */}
      {showAddModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Provision New Platform User</h3>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="modal-form-content">
              <div className="form-group">
                <label>Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jennifer Lopez"
                  value={newUser.fullName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, fullName: e.target.value })
                  }
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    placeholder="jlopez"
                    value={newUser.username}
                    onChange={(e) =>
                      setNewUser({ ...newUser, username: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="jennifer@example.com"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Assigned Access Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="role-modal-select"
                >
                  <option value="CUSTOMER">Customer (Default)</option>
                  <option value="RESTAURANT_OWNER">Restaurant Merchant Owner</option>
                  <option value="DELIVERY_PERSON">Delivery Courier / Rider</option>
                  <option value="ADMIN">Platform Super Admin</option>
                </select>
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
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
