import React, { createContext, useState, useEffect } from 'react';
import { food_list as initialFoodList, restaurants_data as initialRestaurants, restraunts_list } from '../assets/assets';
import { registerUser, loginUser } from '../apiService/api';

export const StoreContext = createContext(null);

const INITIAL_ORDERS = [
  {
    id: 'ORD-1092',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    customerName: 'Sarah Jenkins',
    customerPhone: '+1 (555) 234-8901',
    deliveryAddress: '123 Elm Street, Apt 4B, New York, NY',
    restaurantId: '1',
    restaurantName: 'Delicious Bites',
    items: [
      { id: '1', name: 'Greek salad', price: 12, quantity: 2 },
      { id: '27', name: 'Creamy Pasta', price: 16, quantity: 1 },
    ],
    subtotal: 40.0,
    deliveryFee: 2.0,
    tax: 2.0,
    discount: 4.0,
    totalAmount: 40.0,
    status: 'PREPARING', // 'CONFIRMED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELED'
    paymentMethod: 'Credit Card',
    paymentStatus: 'PAID',
    etaMinutes: 20,
    driverName: 'Alex Turner',
    driverPhone: '+1 (555) 902-3344',
  },
  {
    id: 'ORD-1091',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    customerName: 'Michael Chang',
    customerPhone: '+1 (555) 789-0123',
    deliveryAddress: '456 Grand Ave, Suite 12, New York, NY',
    restaurantId: '1',
    restaurantName: 'Delicious Bites',
    items: [
      { id: '4', name: 'Chicken Salad', price: 24, quantity: 1 },
      { id: '26', name: 'Tomato Pasta', price: 18, quantity: 1 },
    ],
    subtotal: 42.0,
    deliveryFee: 2.0,
    tax: 2.1,
    discount: 0.0,
    totalAmount: 46.1,
    status: 'OUT_FOR_DELIVERY',
    paymentMethod: 'UPI / Online',
    paymentStatus: 'PAID',
    etaMinutes: 8,
    driverName: 'Carlos Morales',
    driverPhone: '+1 (555) 441-8977',
  },
  {
    id: 'ORD-1088',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    customerName: 'Emily Watson',
    customerPhone: '+1 (555) 321-7654',
    deliveryAddress: '789 Broadway Blvd, New York, NY',
    restaurantId: '2',
    restaurantName: 'Pizza Hut',
    items: [
      { id: '2', name: 'Veg salad', price: 18, quantity: 2 },
    ],
    subtotal: 36.0,
    deliveryFee: 2.0,
    tax: 1.8,
    discount: 5.0,
    totalAmount: 34.8,
    status: 'DELIVERED',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'PAID',
    etaMinutes: 0,
    driverName: 'James Wilson',
    driverPhone: '+1 (555) 888-2311',
  },
];

const StoreContextProvider = (props) => {
  // Food Catalog State
  const [food_list, setFoodList] = useState(initialFoodList);
  const [restaurants_data, setRestaurantsData] = useState(initialRestaurants);
  
  // Cart State
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('food_cart');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Orders State
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('food_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Table Bookings State
  const [tableBookings, setTableBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('food_table_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Applied Promo Code
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Authentication & RBAC
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('user_role') || 'CUSTOMER'); // 'CUSTOMER' | 'RESTAURANT_OWNER' | 'ADMIN'
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('user_profile');
      return saved ? JSON.parse(saved) : { name: 'Demo User', email: 'demo@foodapp.com' };
    } catch {
      return { name: 'Demo User', email: 'demo@foodapp.com' };
    }
  });
  const [loading, setLoading] = useState(false);

  // Save Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('food_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save Orders to LocalStorage
  useEffect(() => {
    localStorage.setItem('food_orders', JSON.stringify(orders));
  }, [orders]);

  // Save Table Bookings
  useEffect(() => {
    localStorage.setItem('food_table_bookings', JSON.stringify(tableBookings));
  }, [tableBookings]);

  // Cart Operations
  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return { ...prev, [itemId]: current - 1 };
    });
  };

  const deleteFromCart = (itemId) => {
    setCartItems((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const clearCart = () => {
    setCartItems({});
    setAppliedPromo(null);
  };

  const getTotalCartAmount = () => {
    let subtotal = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const item = food_list.find((p) => String(p._id) === String(itemId));
        if (item) {
          subtotal += item.price * cartItems[itemId];
        }
      }
    }
    return Number(subtotal.toFixed(2));
  };

  const applyPromoCode = (code) => {
    if (!code) return { success: false, message: 'Please enter a promo code.' };
    const normalized = code.trim().toUpperCase();
    if (normalized === 'SAVE10') {
      const discountPercent = 10;
      setAppliedPromo({ code: 'SAVE10', type: 'percent', value: discountPercent });
      return { success: true, message: '10% discount applied!' };
    }
    if (normalized === 'WELCOME50') {
      setAppliedPromo({ code: 'WELCOME50', type: 'fixed', value: 5.0 });
      return { success: true, message: '$5.00 discount applied!' };
    }
    return { success: false, message: 'Invalid or expired promo code. Try "SAVE10" or "WELCOME50".' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // Order Operations
  const createOrder = (orderPayload) => {
    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal > 50 ? 0.0 : 2.0;
    const tax = Number((subtotal * 0.05).toFixed(2));
    let discount = 0;
    if (appliedPromo) {
      if (appliedPromo.type === 'percent') {
        discount = Number(((subtotal * appliedPromo.value) / 100).toFixed(2));
      } else {
        discount = appliedPromo.value;
      }
    }
    const finalTotal = Math.max(0, Number((subtotal + deliveryFee + tax - discount).toFixed(2)));

    // Extract item details
    const orderItems = [];
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const item = food_list.find((p) => String(p._id) === String(itemId));
        if (item) {
          orderItems.push({
            id: item._id,
            name: item.name,
            price: item.price,
            quantity: cartItems[itemId],
            image: item.image,
          });
        }
      }
    }

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      customerName: `${orderPayload.firstName || ''} ${orderPayload.lastName || ''}`.trim() || userProfile.name,
      customerPhone: orderPayload.phone || '+1 (555) 000-1122',
      customerEmail: orderPayload.email || userProfile.email,
      deliveryAddress: `${orderPayload.street || ''}, ${orderPayload.city || ''}, ${orderPayload.state || ''} ${orderPayload.pinCode || ''}`,
      restaurantId: '1',
      restaurantName: 'Delicious Bites',
      items: orderItems,
      subtotal,
      deliveryFee,
      tax,
      discount,
      totalAmount: finalTotal,
      status: 'CONFIRMED',
      paymentMethod: orderPayload.paymentMethod || 'Credit Card',
      paymentStatus: 'PAID',
      deliveryInstructions: orderPayload.instructions || 'Standard delivery',
      etaMinutes: 30,
      driverName: 'Assigned upon preparation',
      driverPhone: 'Pending',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          let updatedEta = o.etaMinutes;
          if (newStatus === 'PREPARING') updatedEta = 20;
          if (newStatus === 'READY_FOR_PICKUP') updatedEta = 15;
          if (newStatus === 'OUT_FOR_DELIVERY') updatedEta = 10;
          if (newStatus === 'DELIVERED') updatedEta = 0;
          if (newStatus === 'CANCELED') updatedEta = 0;

          return {
            ...o,
            status: newStatus,
            etaMinutes: updatedEta,
            driverName: newStatus === 'OUT_FOR_DELIVERY' && o.driverName.includes('Assigned') ? 'Marcus Sterling' : o.driverName,
            driverPhone: newStatus === 'OUT_FOR_DELIVERY' ? '+1 (555) 872-9100' : o.driverPhone,
          };
        }
        return o;
      })
    );
  };

  const cancelOrder = (orderId, reason = 'Customer request') => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELED', cancelReason: reason } : o))
    );
  };

  const getOrderById = (orderId) => {
    return orders.find((o) => o.id === orderId);
  };

  // Table Reservation
  const bookTable = (bookingData) => {
    const booking = {
      id: `RES-${Date.now()}`,
      ...bookingData,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };
    setTableBookings((prev) => [booking, ...prev]);
    return booking;
  };

  // Menu Management for Restaurant Owners
  const addFoodItem = (newItem) => {
    const dish = {
      _id: String(Date.now()),
      ...newItem,
    };
    setFoodList((prev) => [dish, ...prev]);
    return dish;
  };

  const updateFoodItem = (id, updatedFields) => {
    setFoodList((prev) =>
      prev.map((item) => (item._id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteFoodItem = (id) => {
    setFoodList((prev) => prev.filter((item) => item._id !== id));
  };

  // Auth Functions
  const handleRegister = async (userData) => {
    setLoading(true);
    try {
      const response = await registerUser(userData);
      const generatedToken = response?.token || `jwt-${Date.now()}`;
      setToken(generatedToken);
      localStorage.setItem('token', generatedToken);
      setUserRole(userData.role || 'CUSTOMER');
      localStorage.setItem('user_role', userData.role || 'CUSTOMER');
      const profile = { name: userData.fullName || userData.username, email: userData.email };
      setUserProfile(profile);
      localStorage.setItem('user_profile', JSON.stringify(profile));
      return { success: true, token: generatedToken };
    } catch (err) {
      // Demo Fallback for resilience
      const fallbackToken = `jwt-demo-${Date.now()}`;
      setToken(fallbackToken);
      localStorage.setItem('token', fallbackToken);
      setUserRole(userData.role || 'CUSTOMER');
      localStorage.setItem('user_role', userData.role || 'CUSTOMER');
      const profile = { name: userData.fullName || userData.username, email: userData.email };
      setUserProfile(profile);
      localStorage.setItem('user_profile', JSON.stringify(profile));
      return { success: true, token: fallbackToken };
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (userData) => {
    setLoading(true);
    try {
      const response = await loginUser(userData);
      const jwtToken = response?.token || `jwt-${Date.now()}`;
      setToken(jwtToken);
      localStorage.setItem('token', jwtToken);
      const assignedRole = userData.role || (userData.email.includes('admin') ? 'ADMIN' : userData.email.includes('owner') ? 'RESTAURANT_OWNER' : 'CUSTOMER');
      setUserRole(assignedRole);
      localStorage.setItem('user_role', assignedRole);
      const profile = { name: userData.email.split('@')[0], email: userData.email };
      setUserProfile(profile);
      localStorage.setItem('user_profile', JSON.stringify(profile));
      return { success: true, token: jwtToken };
    } catch (err) {
      // Demo fallback
      const fallbackToken = `jwt-demo-${Date.now()}`;
      setToken(fallbackToken);
      localStorage.setItem('token', fallbackToken);
      const assignedRole = userData.role || (userData.email.includes('admin') ? 'ADMIN' : userData.email.includes('owner') ? 'RESTAURANT_OWNER' : 'CUSTOMER');
      setUserRole(assignedRole);
      localStorage.setItem('user_role', assignedRole);
      const profile = { name: userData.email.split('@')[0], email: userData.email };
      setUserProfile(profile);
      localStorage.setItem('user_profile', JSON.stringify(profile));
      return { success: true, token: fallbackToken };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUserRole('CUSTOMER');
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
  };

  const switchRole = (role) => {
    setUserRole(role);
    localStorage.setItem('user_role', role);
  };

  const contextValue = {
    food_list,
    restaurants_data,
    restraunts_list,
    cartItems,
    addToCart,
    removeFromCart,
    deleteFromCart,
    clearCart,
    getTotalCartAmount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    orders,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    getOrderById,
    tableBookings,
    bookTable,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    token,
    userRole,
    userProfile,
    switchRole,
    handleRegister,
    handleLogin,
    handleLogout,
    loading,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;