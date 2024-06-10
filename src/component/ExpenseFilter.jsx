import React from 'react';

const ExpenseFilter = ({ month, year, onFilterChange }) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleMonthChange = (e) => {
    onFilterChange(e.target.value, year);
  };

  const handleYearChange = (e) => {
    onFilterChange(month, e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row items-center mb-4">
      <div className="flex flex-col mb-2 md:mb-0 md:mr-4">
        <label htmlFor="month" className="mb-1 text-gray-700 font-semibold">Month</label>
        <select 
          id="month" 
          value={month} 
          onChange={handleMonthChange} 
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {monthNames.map((name, index) => (
            <option key={index} value={index + 1}>{name}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label htmlFor="year" className="mb-1 text-gray-700 font-semibold">Year</label>
        <select 
          id="year" 
          value={year} 
          onChange={handleYearChange} 
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {Array.from({ length: 10 }, (v, k) => new Date().getFullYear() - k).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ExpenseFilter;
