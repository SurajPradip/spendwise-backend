import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import api from './api';

const MonthlyDetail = () => {
  const [response, setResponse] = useState({});
  const location = useLocation();
  const { month, year } = location.state || {};
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await api.get('django/get-day-by-day-detail/', {
        params: { month, year }
      });
      setResponse(res.data.response); 
    } catch (err) {
      console.log(err);
    }
  }

  const handleDaySpending = (date) => {
    const day = parseInt(date.split('-')[0], 10);
    navigate('/day-spending-details', { state: { day, month, year } });
  }

  useEffect(() => {
    if (month && year) {
      fetchData();
    }
  }, [month, year]);

  const getPriceColor = (price) => {
    if (price > 400) {
      return 'bg-red-200';
    } else if (price < 200) {
      return 'bg-green-200';
    } else {
      return 'bg-yellow-200';
    }
  };

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

      {response && Object.entries(response).map(([date, day_details]) => (
        <div 
          key={date} 
          onClick={() => handleDaySpending(date)} 
          className="hover:cursor-pointer bg-blue-100 hover:scale-105 hover:bg-blue-200 transform transition duration-300 rounded-lg shadow-md p-4 flex flex-col justify-between"
        >
          <div className="mb-2 p-2 bg-indigo-500 text-white rounded-lg text-center">
            <h2 className="text-lg font-semibold">{date}</h2>
          </div>
          <div className={`mb-2 p-2 rounded-lg text-center ${getPriceColor(day_details.day_spending)}`}>
            <label className="block text-gray-700 font-medium mb-1">Total Spending:</label>
            <div className="text-gray-900 text-xl font-bold">₹{day_details.day_spending}</div>
          </div>
          <div className="mb-2 text-center">
            <label className="block text-gray-700 font-medium">Categories:</label>
            <div className="flex flex-wrap justify-center">
              {day_details.categories.map((category, index) => (
                <span key={index} className="m-1 px-2 py-1 bg-blue-200 text-blue-900 rounded-full text-sm font-medium">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonthlyDetail;
