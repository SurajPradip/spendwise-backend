import { useState, useEffect } from 'react';
import React from "react";
import api from './api';

const ExpenseListing = ({ refreshGraph, month, year }) => {
  const [spending, setSpending] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (month, year) => {
    try {
      const response = await api.get('/django/create-or-list-spending-obj/', {
        params: {
          month: month,
          year: year
        }
      });
      setSpending(response.data.response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(month, year);
  }, [month, year]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/django/delete-spending-obj/${id}/`);
      setSpending(spending.filter(item => item.id !== id));
      refreshGraph();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (id) => {
    console.log(id);
  };

  return (
    <div className="overflow-y-auto ">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-center border border-black">Date</th>
            <th className="px-4 py-2 text-center border border-black">Reason</th>
            <th className="px-4 py-2 text-center border border-black">Category</th>
            <th className="px-4 py-2 text-center border border-black">Price</th>
            <th className="px-4 py-2 text-center border border-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {spending && spending.map((element, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-r border-gray-400">{element.date}</td>
              <td className="px-4 py-2 border-r border-gray-400">{element.reason}</td>
              <td className="px-4 py-2 border-r border-gray-400">{element.category}</td>
              <td className="px-4 py-2 border-r border-gray-400">{element.price}</td>
              <td className="px-4 py-2 border-r border-gray-400 w-1/8 flex items-center justify-center">
                <div className="flex">
                  <button
                    onClick={() => handleDelete(element.id)}
                    className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2"
                  >
                    x
                  </button>
                  <button
                    onClick={() => handleEdit(element.id)}
                    className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    E
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseListing;
