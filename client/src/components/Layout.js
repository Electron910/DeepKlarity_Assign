import React from 'react';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <h1 className="logo">
            <span className="logo-icon">📄</span>
            Resume Analyzer
          </h1>
          <p className="tagline">AI-Powered Resume Analysis & Insights</p>
        </div>
      </header>
      
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Resume Analyzer. Built with React, Node.js & Gemini AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;