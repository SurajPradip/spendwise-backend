import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import api from './api';

const CategoryDetails = () => {
  const [response, setResponse] = useState({});
  const location = useLocation();
  const { month, year } = location.state || {};

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

  useEffect(() => {
    if (month && year) {
      fetchData();
    }
  }, [month, year]);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {response && Object.entries(response).map(([date, day_details]) => (
        <div key={date} className="bg-blue-100 hover:scale-105 hover:bg-blue-200 transform transition duration-300 rounded-lg shadow-md p-4 flex flex-col justify-between">
          <div className="mb-2 p-2 bg-indigo-500 text-white rounded-lg text-center">
            <h2 className="text-lg font-semibold">{date}</h2>
          </div>
          <div className="mb-2 p-2 bg-yellow-200 rounded-lg">
            <label className="block text-gray-700 font-medium mb-1">Total Spending:</label>
            <div className="text-gray-900 text-xl font-bold">₹{day_details.day_spending}</div>
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 font-medium">Categories:</label>
            <div className="flex flex-wrap">
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

export default CategoryDetails;
