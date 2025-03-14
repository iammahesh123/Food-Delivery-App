import { createContext, useState } from "react";
import { food_list } from "../assets/assets";
import { registerUser, loginUser } from "../apiService/api";

export const StoreContext = createContext({
    food_list: [],
    cartItems: {},
    setCartItems: () => {},
    addToCart: () => {},
    removeFromCart: () => {},
    getTotalCartAmount: () => 0,
    url: "",
    token: "",
    setToken: () => {},
    handleRegister: async () => {},
    handleLogin: async () => {},
    handleLogout: () => {},
});

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem("token");
        console.log("Token retrieved from localStorage:", storedToken); // Debugging
        return storedToken || "";
    });
    const [loading, setLoading] = useState(false);
    const url = "http://localhost:8080";

    const addToCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
        }));
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: Math.max(0, prev[itemId] - 1),
        }));
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount.toFixed(2);
    };

    const handleRegister = async (userData) => {
        setLoading(true);
        try {
            const response = await registerUser(userData);
            console.log("Register Response:", response); // Debugging
            if (response.token) { // Check for token instead of success
                setToken(response.token);
                localStorage.setItem("token", response.token);
                console.log("Token saved to localStorage:", response.token); // Debugging
                return { success: true };
            } else {
                return { success: false, message: "Registration failed. No token received." };
            }
        } catch (error) {
            console.error("Registration failed:", error);
            return { success: false, message: "Registration failed. Please try again." };
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (userData) => {
        setLoading(true);
        try {
            const response = await loginUser(userData);
            console.log("Login Response:", response); // Debugging
            if (response.token) { // Check for token instead of success
                setToken(response.token);
                localStorage.setItem("token", response.token);
                console.log("Token saved to localStorage:", response.token); // Debugging
                return { success: true };
            } else {
                return { success: false, message: "Login failed. No token received." };
            }
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, message: "Login failed. Please try again." };
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setToken("");
        localStorage.removeItem("token");
    };

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
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