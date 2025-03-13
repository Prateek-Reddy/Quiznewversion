import React from 'react';
import logo from './logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#007367] text-[#f0e1cb] py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left Section: Logo and Description */}
          <div className="flex items-center mb-4 md:mb-0">
            <img
              src={logo} // Replace with your logo path
              alt="Placement Assistant Logo"
              className="h-5 w-12 mr-4"
            />
            <p className="text-sm max-w-xs">
              Placement Assistant is your one-stop solution for preparing for placement interviews.
            </p>
          </div>


          {/* Right Section: Contact Info */}
          <div className="text-sm">
            <p>Contact Us:</p>
            <p>Email: support@placementassistant.com</p>
            <p>Phone: +91 12345 67890</p>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-[#f0e1cb] mt-6 pt-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Placement Assistant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;