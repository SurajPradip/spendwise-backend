import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './component/front.jsx';
import Home from './component/home.jsx';
import DaySpending from './component/DaySpending.jsx'
import Navbar from './component/navbar.jsx';
import MonthlyDetail from  './component/Monthlydetail.jsx'  
import CategoryDetails from './component/CategoryDetails.jsx'
import './index.css';
import Dashboard from './component/Dashboard.jsx';

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  return (
    <div className="min-h-screen bg-gray-100">
      {!isLoginPage && <Navbar />}
      <div className="p-4 w-full h-screen">
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/expense' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/monthly-detail' element={<MonthlyDetail />} />
          <Route path='/category-detail' element={<CategoryDetails />} />
          <Route path='/day-spending-details' element={<DaySpending/>} />
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
