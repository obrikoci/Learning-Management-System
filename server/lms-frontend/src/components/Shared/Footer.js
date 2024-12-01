import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 position-fixed bottom-0 w-100">
      <div className="container">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} <strong>LMS Platform</strong>. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

