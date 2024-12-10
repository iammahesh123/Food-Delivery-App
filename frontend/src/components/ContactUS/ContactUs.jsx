import React from "react";
import "./ContactUs.css";

const ContactUs = () => {
    return (
        <div className="contact-main-container" id="contactus">
            <h1>Get in touch</h1>
            <p>We'd love to hear from you! Whether you have questions, 
                feedback, or just want to say hello, feel free to reach out to us.
                You can fill out the form below, and we'll get back to you as soon as possible.

            </p>
            <div className="contact-us-container">
                {/* Left Section */}
                <div className="contact-us-left">
                    <h2>Contact Us</h2>
                    <p>
                        Have any questions or need assistance?
                        Reach out to us, and we'll get back to you as soon as possible.
                    </p>
                    <p>
                        Your feedback and queries are important to us. Let’s connect!
                    </p>
                </div>

                {/* Right Section - Form */}
                <div className="contact-us-right">
                    <h2>Enter Your Details</h2>
                    <form className="contact-form">
                        <input type="text" placeholder="Your Name" required />
                        <input type="email" placeholder="Your Email" required />
                        <input type="tel" placeholder="Your Phone Number" />
                        <textarea placeholder="Your Query" rows="4" required></textarea>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
