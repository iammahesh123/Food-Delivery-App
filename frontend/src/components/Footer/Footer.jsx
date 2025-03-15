import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo2} alt='Company Logo'/>
                <p>Experience the finest flavors from around 
                    the world with C Tomato, where exceptional 
                    cuisine meets convenience. Our mission is to 
                    deliver delicious, quality meals directly to you, 
                    ensuring a delightful dining experience from the 
                    comfort of your home. </p>
            </div>
            <div className="footer-content-center">
                <h2>Company</h2>
                <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>Get In Touch</h2>
                <ul>
                    <li>+9897474433</li>
                    <li>dummy@gmail.com</li>
                </ul>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="Facebook" />
                    <img src={assets.twitter_icon} alt="Twitter" />
                    <img src={assets.linkedin_icon} alt="LinkedIn" />
                </div>
            </div>
        </div>
        <hr/>
        <p className="footer-copyright">
            2024 &copy; foodguru.vercel.app All Rights Reserved.
        </p>
    </div>
  )
}

export default Footer
