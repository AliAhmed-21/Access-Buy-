import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#090a0a] text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          {/* Logo and Branding */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2">
              <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
                <path
                  clipRule="evenodd"
                  d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
              <span className="text-xl font-bold">ACCESSBUY</span>
            </div>
            <p className="text-gray-400 mt-2 text-center md:text-left">
              © 2024 ACCESSBUY Inc. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-evenly md:items-start">
            <h3 className="font-bold mb-2 text-center">Quick Links</h3>
            <ul className="space-y-1 flex flex-wrap justify-center space-x-4 cursor-pointer">
              
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                  Store
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-gray-400 hover:text-white transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/confirm-order" className="text-gray-400 hover:text-white transition-colors">
                  Order Confirm
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-gray-400 hover:text-white transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/order-tracking" className="text-gray-400 hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-2">Contact Us</h3>
            <p className="text-gray-400">Email: support@accessbuy.com</p>
            <p className="text-gray-400">Phone: +1 (123) 456-7890</p>
          </div>
        </div>

        {/* Social and Legal Links */}
        <div className="mt-8 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-center md:justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
