import React from 'react';
import Navbar from './Navbar';

const PageTemplate = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
};

export default PageTemplate;