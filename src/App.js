import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './component/front.jsx';
import Home from './component/home.jsx';
import Navbar from './component/navbar.jsx';  // Import the Navbar component
import './index.css';

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="h-screen flex flex-col">
      {!isLoginPage && <Navbar />}
      <div className="flex flex-grow items-center justify-center">
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
