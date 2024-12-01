import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} LMS Platform. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
