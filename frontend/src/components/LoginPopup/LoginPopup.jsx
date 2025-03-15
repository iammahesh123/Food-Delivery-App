import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const LoginPopup = ({ setShowLogin }) => {
    const { handleRegister, handleLogin, handleForgotPassword, setToken } = useContext(StoreContext);
    const [currentState, setCurrentState] = useState("Login");
    const [data, setData] = useState({ fullName: "", username: "", email: "", password: "", role: "CUSTOMER" });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateForm = () => {
        if (currentState === "Register") {
            if (!data.fullName || !data.username || !data.email || !data.password) {
                setErrorMessage("All fields are required.");
                return false;
            }
            if (data.password.length < 6) {
                setErrorMessage("Password must be at least 6 characters.");
                return false;
            }
        } else if (currentState === "Login") {
            if (!data.email || !data.password) {
                setErrorMessage("Email and password are required.");
                return false;
            }
        }
        return true;
    };


    const onLogin = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            let response;
            if (currentState === "Register") {
                const registrationData = { ...data, role: "CUSTOMER" };
                response = await handleRegister(registrationData); 
                console.log("Register Response:", response);
            } else {
                response = await handleLogin({
                    email: data.email,
                    password: data.password,
                });
            }

            if (response.success) {
                setSuccessMessage(currentState === "Register" ? "Registration successful!" : "Login successful!");
                if (response.token) {
                    setToken(response.token); 
                }
                setTimeout(() => {
                    setShowLogin(false); 
                }, 1500); 
            } else {
                setErrorMessage(response.message || "An error occurred.");
            }
            }
        catch (error) {
            console.error(error);
            setErrorMessage("An error occurred during the request.");
        }
        finally {
            setIsLoading(false); 
        }
    };

    const onForgotPassword = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!forgotPasswordEmail) {
            setErrorMessage("Email is required.");
            return;
        }

        setIsLoading(true); 

        try {
            const response = await handleForgotPassword({ email: forgotPasswordEmail });

            if (response.success) {
                setSuccessMessage("Password reset instructions have been sent to your email.");
                setShowForgotPassword(false);
            } else {
                setErrorMessage(response.message || "An error occurred.");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("An error occurred during the request.");
        } finally {
            setIsLoading(false); 
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
                            placeholder="Enter Your email"
                            required
                        />
                    </div>
                ) : (
                    <div className="login-popup-inputs">
                        {currentState === "Register" && (
                            <>
                                <input
                                    type="text"
                                    name="fullName"
                                    onChange={onChangeHandler}
                                    value={data.fullName}
                                    placeholder='Your full name'
                                    required
                                />
                                <input
                                    type="text"
                                    name="username"
                                    onChange={onChangeHandler}
                                    value={data.username}
                                    placeholder='Your username'
                                    required
                                />
                                {/* <select
                                    name="role"
                                    onChange={onChangeHandler}
                                    value={data.role}
                                    required
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select> */}
                            </>
                        )}
                        <input
                            type="email"
                            name="email"
                            onChange={onChangeHandler}
                            value={data.email}
                            placeholder="Your email"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            onChange={onChangeHandler}
                            value={data.password}
                            placeholder='Enter Password'
                            required
                        />
                    </div>
                )}
                <button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : showForgotPassword ? "Submit" : currentState === "Register" ? "Create account" : "Login"}
                </button>
                {!showForgotPassword && (
                    <div className="login-popup-condition">
                        <input type="checkbox" name="" id="" required />
                        <p>By continuing, I agree to the terms of use & privacy policy.</p>
                    </div>
                )}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
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