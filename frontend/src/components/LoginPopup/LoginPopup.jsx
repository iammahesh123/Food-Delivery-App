import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext);
    const [currentState, setCurrentState] = useState("Register");
    const [data, setData] = useState({ name: "", email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();

        let newUrl = `${url}/api/users/${currentState.toLowerCase()}`;
        try {
            const response = await axios.post(newUrl, data);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("An error occurred during the request.");
        }
    };

    return (
        <div className='login-popup'>
            <form className="login-popup-container" onSubmit={onLogin}>
                <div className="login-popup-title">
                    <h2>{currentState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" className="src" />
                </div>
                <div className="login-popup-inputs">
                    {currentState === "Register" && <input type="text" name="name" onChange={onChangeHandler} value={data.name} placeholder='Your name' required />}
                    <input type="email" name="email" onChange={onChangeHandler} value={data.email} placeholder="Your email" required />
                    <input type="password" name="password" onChange={onChangeHandler} value={data.password} placeholder='Enter Password' required />
                </div>
                <button type="submit">
                    {currentState === "Register" ? "Create account" : "Login"}
                </button>
                <div className="login-popup-condition">
                    <input type="checkbox" name="" id="" required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {currentState === "Login" ? (
                    <p>Create a new account? <span onClick={() => setCurrentState("Register")}>Click here</span></p>
                ) : (
                    <p>Already have an account? <span onClick={() => setCurrentState("Login")}>Click here</span></p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;
