import React, { useContext, useState } from 'react';
import { StoreContext } from '../../../context/StoreContext';
import { Plus, Edit2, Trash2, Check, X, Tag, DollarSign } from 'lucide-react';
import DataTable from '../../ui/DataTable';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Input from '../../ui/Input';
import Toast from '../../ui/Toast';
import ConfirmDialog from '../../ui/ConfirmDialog';
import './MenuManager.css';

const MenuManager = () => {
  const { food_list, addFoodItem, updateFoodItem, deleteFoodItem } = useContext(StoreContext);

  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  // New Dish Form State
  const [newDish, setNewDish] = useState({
    name: '',
    category: 'Salad',
    price: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop',
  });

  const columns = [
    {
      key: 'image',
      title: 'Dish',
      width: '70px',
      render: (img, row) => (
        <img src={img} alt={row.name} className="menu-dish-thumb" />
      ),
    },
    {
      key: 'name',
      title: 'Item Details',
      sortable: true,
      render: (name, row) => (
        <div className="dish-name-cell">
          <strong className="dish-title">{name}</strong>
          <span className="dish-desc">{row.description}</span>
        </div>
      ),
    },
    {
      key: 'category',
      title: 'Category',
      sortable: true,
      render: (cat) => <Badge variant="neutral">{cat}</Badge>,
    },
    {
      key: 'price',
      title: 'Price ($)',
      sortable: true,
      align: 'right',
      render: (p) => <span className="dish-price-val">${Number(p).toFixed(2)}</span>,
    },
    {
      key: 'status',
      title: 'Availability',
      align: 'center',
      render: (_, row) => (
        <Badge variant={row.outOfStock ? 'canceled' : 'success'}>
          {row.outOfStock ? 'Out of Stock' : 'In Stock'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="table-row-actions">
          <button
            type="button"
            className="row-action-btn toggle-stock"
            title="Toggle Stock Availability"
            onClick={() => {
              updateFoodItem(row._id, { outOfStock: !row.outOfStock });
              setToast({ text: `Updated availability for ${row.name}`, type: 'info' });
            }}
          >
            {row.outOfStock ? 'Restock' : 'Mark Sold Out'}
          </button>
          <button
            type="button"
            className="row-action-btn delete"
            title="Delete Dish"
            onClick={() => setDeleteId(row._id)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const handleCreateDish = (e) => {
    e.preventDefault();
    if (!newDish.name.trim() || !newDish.price) {
      alert('Please enter dish name and price.');
      return;
    }

    addFoodItem({
      ...newDish,
      price: Number(newDish.price),
    });

    setToast({ text: `Added "${newDish.name}" to menu catalog.`, type: 'success' });
    setShowAddModal(false);
    setNewDish({
      name: '',
      category: 'Salad',
      price: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop',
    });
  };

  const handleBulkDelete = (ids) => {
    ids.forEach((id) => deleteFoodItem(id));
    setSelectedRowIds([]);
    setToast({ text: `Removed ${ids.length} items from catalog.`, type: 'info' });
  };

  const handleBulkStockToggle = (ids, status) => {
    ids.forEach((id) => updateFoodItem(id, { outOfStock: status }));
    setSelectedRowIds([]);
    setToast({ text: `Updated stock for ${ids.length} dishes.`, type: 'success' });
  };

  return (
    <div className="menu-manager-page fade-in">
      {toast && <Toast message={toast.text} type={toast.type} onClose={() => setToast(null)} />}

      <div className="manager-header">
        <div>
          <h1 className="manager-title">Menu & Dishes Catalog</h1>
          <p className="manager-desc">
            Manage dish pricing, recipe descriptions, stock availability, and categories.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => setShowAddModal(true)}
        >
          Add New Dish
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={food_list}
        keyField="_id"
        selectable
        selectedRows={selectedRowIds}
        onSelectRow={(id) => {
          setSelectedRowIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
          );
        }}
        onSelectAll={(checked, paginatedItems) => {
          if (checked) {
            setSelectedRowIds(paginatedItems.map((p) => p._id));
          } else {
            setSelectedRowIds([]);
          }
        }}
        bulkActions={[
          {
            label: 'Mark In Stock',
            variant: 'secondary',
            onClick: (ids) => handleBulkStockToggle(ids, false),
          },
          {
            label: 'Mark Sold Out',
            variant: 'secondary',
            onClick: (ids) => handleBulkStockToggle(ids, true),
          },
          {
            label: 'Delete Selected',
            variant: 'destructive',
            onClick: (ids) => handleBulkDelete(ids),
          },
        ]}
        searchPlaceholder="Search dishes by name or category..."
        pageSize={8}
      />

      {/* Add New Dish Modal */}
      {showAddModal && (
        <div className="modal-backdrop fade-in" onClick={() => setShowAddModal(false)}>
          <div className="add-dish-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <h2>Add New Menu Item</h2>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="add-dish-form">
              <Input
                label="Dish Name"
                value={newDish.name}
                onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                placeholder="e.g. Truffle Mushroom Risotto"
                required
              />

              <div className="modal-form-row">
                <div className="form-field">
                  <label className="form-label">Category</label>
                  <select
                    value={newDish.category}
                    onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                    className="category-select"
                  >
                    {['Salad', 'Rolls', 'Deserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles'].map(
                      (cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <Input
                  label="Price ($)"
                  type="number"
                  step="0.5"
                  value={newDish.price}
                  onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                  placeholder="14.50"
                  required
                />
              </div>

              <Input
                label="Description"
                value={newDish.description}
                onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                placeholder="Brief ingredients or culinary notes..."
              />

              <Input
                label="Image URL"
                value={newDish.image}
                onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                placeholder="https://..."
              />

              <div className="modal-btn-row">
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Create Dish
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Menu Dish"
        message="Are you sure you want to remove this dish permanently from the ordering catalog?"
        confirmText="Delete Dish"
        variant="destructive"
        onConfirm={() => {
          deleteFoodItem(deleteId);
          setDeleteId(null);
          setToast({ text: 'Dish deleted successfully.', type: 'info' });
        }}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
};

export default MenuManager;
