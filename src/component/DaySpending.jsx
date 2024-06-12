import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import api from './api.jsx';

const DaySpending = () => {
  const [response, setResponse] = useState([]);
  const[date,setDate] = useState('')
  const location = useLocation();
  const { day, month, year } = location.state || {};

  const fetchData = async () => {
    try {
      const res = await api.get(`django/day-spending/${day}/`, {
        params: { month, year }
      });
      setResponse(res.data.response); 
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (day) {
      fetchData();
    }
  }, [day]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Day Spending Details</h1>
      {response.length > 0 ? response.map((spendings) => (
        <div key={spendings.id} className="flex flex-row items-center justify-between bg-white rounded-lg shadow-md p-4 my-2">
          <div className="flex flex-col items-center flex-grow bg-blue-100 p-2 rounded-md">
            <div className="text-md font-medium text-gray-700">{spendings.reason}</div>
          </div>
          <div className="flex flex-col items-center bg-yellow-100 p-2 rounded-md mx-2 w-24">
            <div className="text-sm font-medium text-gray-700">₹{spendings.price}</div>
          </div>
          <div className="flex flex-col items-center flex-grow bg-green-100 p-2 rounded-md">
            <div className="text-sm font-medium text-gray-700">{spendings.category}</div>
          </div>
        </div>
      )) : (
        <p className="text-gray-500">No spending details available</p>
      )}
    </div>
  );
}

export default DaySpending;
