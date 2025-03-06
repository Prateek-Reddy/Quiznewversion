import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-20 text-center mt-8">
      <p>&copy; {new Date().getFullYear()} Placement Assistant. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;