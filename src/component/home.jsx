import React, { useState, useEffect } from 'react';
import '../index.css';
import api from './api.jsx';
import ExpenseListing from './expenselisting.jsx';
import ExpenseFilter from './ExpenseFilter.jsx';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ExpenseForm from './expenseform.jsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options_line = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Per-day Expense',
    },
  },
};

const options_bar = {
  plugins: {
    title: {
      display: true,
      text: 'Category Wise',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  maintainAspectRatio: false,
};

const Home = () => {
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Dataset 1',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  });
  
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Expense',
        data: [],
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  });

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchData = async (month = new Date().getMonth() + 1, year = new Date().getFullYear()) => {
    try {
      const params = {
        params: {
          month: month,
          year: year,
        },
      };

      const lineResponse = await api.get('/django/get-per-day-expense/', params);
      const barResponse = await api.get('/django/get-category-wise-expense/', params);

      if (lineResponse.data.expense_per_day) {
        const lineData = {
          labels: lineResponse.data.expense_per_day.labels,
          datasets: [{
            label: 'Expense',
            data: lineResponse.data.expense_per_day.data,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
          }],
        };
        setGraphData(lineData);
      }

      if (barResponse.data.category_wise) {
        const barData = {
          labels: barResponse.data.category_wise.labels,
          datasets: [{
            label: 'Expense',
            data: barResponse.data.category_wise.data,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(0,255,255,0.5)',
            fill: true,
            maxBarThickness: 50,
          }],
        };
        setBarData(barData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(month, year);
  }, [month, year]);

  const handleFilterChange = (selectedMonth, selectedYear) => {
    setMonth(selectedMonth);
    setYear(selectedYear);
    fetchData(selectedMonth, selectedYear);
  };
  const navigate = useNavigate();

  const handleCategoryDetail = () => {
    navigate('/category-detail/',{ state: { month, year } })
  }

  const handleMonthlyDetail = () => {
    navigate('/monthly-detail/', { state: { month, year } });
  }

  return (
    <div className="container mx-auto p-4">
      <div className="w-full mb-4">
        <ExpenseForm />
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 p-2">
          <ExpenseFilter month={month} year={year} onFilterChange={handleFilterChange} />
          <ExpenseListing refreshGraph={() => fetchData(month, year)} month={month} year={year} />
        </div>
        <div className="w-full md:w-1/3 p-2">
          <div className="flex flex-col sticky top-0">
            <div className="w-full p-2 hover:scale-105 transition transform duration-300" onClick={handleMonthlyDetail}>
              <Line data={graphData} options={options_line} className="h-96 hover:shadow-2xl hover:cursor-pointer rounded-2xl" />
            </div>
            <div className="w-full p-2 hover:scale-105 transition transform duration-300">
              <Bar data={barData} options={options_bar} className="h-96 hover:shadow-2xl hover:cursor-pointer rounded-2xl" onClick={handleCategoryDetail}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
