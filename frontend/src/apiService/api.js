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