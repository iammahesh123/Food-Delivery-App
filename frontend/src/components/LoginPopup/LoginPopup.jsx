import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const LoginPopup = ({ setShowLogin }) => {
    const { handleRegister, handleLogin, handleForgotPassword, setToken } = useContext(StoreContext);
    const [currentState, setCurrentState] = useState("Login");
    const [data, setData] = useState({ name: "", email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();

        try {
            let response;
            if (currentState === "Register") {
                response = await handleRegister(data); // Call register function
            } else {
                response = await handleLogin(data); // Call login function
            }

            if (response.success) {
                setShowLogin(false);
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("An error occurred during the request.");
        }
    };

    const onForgotPassword = async (event) => {
        event.preventDefault();

        try {
            const response = await handleForgotPassword({ email: forgotPasswordEmail });

            if (response.success) {
                setErrorMessage("Password reset instructions have been sent to your email.");
                setShowForgotPassword(false);
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("An error occurred during the request.");
        }
    };

    return (
        <div className='login-popup'>
            <form className="login-popup-container" onSubmit={showForgotPassword ? onForgotPassword : onLogin}>
                <div className="login-popup-title">
                    <h2>{showForgotPassword ? "Forgot Password" : currentState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" className="src" />
                </div>
                {showForgotPassword ? (
                    <div className="login-popup-inputs">
                        <input
                            type="email"
                            name="email"
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                            value={forgotPasswordEmail}
                            placeholder="Your email"
                            required
                        />
                    </div>
                ) : (
                    <div className="login-popup-inputs">
                        {currentState === "Register" && <input type="text" name="name" onChange={onChangeHandler} value={data.name} placeholder='Your name' required />}
                        <input type="email" name="email" onChange={onChangeHandler} value={data.email} placeholder="Your email" required />
                        <input type="password" name="password" onChange={onChangeHandler} value={data.password} placeholder='Enter Password' required />
                    </div>
                )}
                <button type="submit">
                    {showForgotPassword ? "Submit" : currentState === "Register" ? "Create account" : "Login"}
                </button>
                {!showForgotPassword && (
                    <div className="login-popup-condition">
                        <input type="checkbox" name="" id="" required />
                        <p>By continuing, I agree to the terms of use & privacy policy.</p>
                    </div>
                )}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {!showForgotPassword && (
                    currentState === "Login" ? (
                        <p>
                            Create a new account? <span onClick={() => setCurrentState("Register")}>Click here</span>
                            <br />
                            Forgot your password? <span onClick={() => setShowForgotPassword(true)}>Click here</span>
                        </p>
                    ) : (
                        <p>Already have an account? <span onClick={() => setCurrentState("Login")}>Click here</span></p>
                    )
                )}
                {showForgotPassword && (
                    <p>
                        Remember your password? <span onClick={() => setShowForgotPassword(false)}>Click here</span>
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;