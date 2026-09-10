import axios from 'axios';

const API_BASE_URL = "https://food-backend-svc-latest.onrender.com"; 
// const API_BASE_URL = "http://localhost:8080"; 

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, userData);
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

// Dining & Table Reservation APIs
export const createDiningReservationApi = async (bookingData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/dining/reservations`, bookingData);
        return response.data;
    } catch (error) {
        console.warn("Backend reservation endpoint unavailable, using local client mode:", error.message);
        return null;
    }
};

export const getUserDiningReservationsApi = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dining/reservations/user/${userId}`);
        return response.data;
    } catch (error) {
        console.warn("Backend reservations lookup unavailable:", error.message);
        return null;
    }
};

export const getRestaurantDiningReservationsApi = async (restaurantId, date) => {
    try {
        const url = date 
            ? `${API_BASE_URL}/dining/reservations/restaurant/${restaurantId}?date=${date}`
            : `${API_BASE_URL}/dining/reservations/restaurant/${restaurantId}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.warn("Backend restaurant reservations lookup unavailable:", error.message);
        return null;
    }
};

export const updateDiningReservationStatusApi = async (id, status, tableNumber) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/dining/reservations/${id}/status`, {
            status,
            tableNumber,
        });
        return response.data;
    } catch (error) {
        console.warn("Backend update reservation status unavailable:", error.message);
        return null;
    }
};

export const cancelDiningReservationApi = async (id) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/dining/reservations/${id}/cancel`);
        return response.data;
    } catch (error) {
        console.warn("Backend cancel reservation unavailable:", error.message);
        return null;
    }
};

export const settleDiningBillApi = async (id, billAmount) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/dining/reservations/${id}/pay-bill`, {
            billAmount,
        });
        return response.data;
    } catch (error) {
        console.warn("Backend settle bill unavailable:", error.message);
        return null;
    }
};

// Live Events & Ticketing APIs
export const getLiveEventsApi = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/events`);
        return response.data;
    } catch (error) {
        console.warn("Backend live events lookup unavailable:", error.message);
        return null;
    }
};

export const getLiveEventByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/events/${id}`);
        return response.data;
    } catch (error) {
        console.warn("Backend event lookup unavailable:", error.message);
        return null;
    }
};

export const bookEventTicketApi = async (ticketData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/events/tickets`, ticketData);
        return response.data;
    } catch (error) {
        console.warn("Backend ticket booking unavailable, running client mode:", error.message);
        return null;
    }
};

export const getUserTicketsApi = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/events/tickets/user/${userId}`);
        return response.data;
    } catch (error) {
        console.warn("Backend user tickets lookup unavailable:", error.message);
        return null;
    }
};

export const checkInTicketApi = async (ticketId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/events/tickets/${ticketId}/check-in`);
        return response.data;
    } catch (error) {
        console.warn("Backend ticket check-in unavailable:", error.message);
        return null;
    }
};

export const cancelTicketApi = async (ticketId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/events/tickets/${ticketId}/cancel`);
        return response.data;
    } catch (error) {
        console.warn("Backend ticket cancel unavailable:", error.message);
        return null;
    }
};