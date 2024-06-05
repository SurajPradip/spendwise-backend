import React from "react";
import '../index.css'; 
import api from './api.jsx'
import ExpenseListing from './expenselisting.jsx'
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
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
import { useState, useEffect } from 'react';
import ExpenseForm from './expenseform.jsx'

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
    // if (loading) {
    //     return <div>Loading...</div>;
    //   }
    const[graphData,setGraphData]=useState({
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
    })
    const[barData,setBarData]=useState({
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

    const fetchData = async () => {
        try {
            const lineResponse = await api.get('/django/get-per-day-expense/');
            const barResponse = await api.get('/django/get-category-wise-expense/');

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
                        maxBarThickness:50,
                    }],
                };
                setBarData(barData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    
    useEffect(() => {
        fetchData();
    }, []);
    

    return (
        <div className="flex w-full h-full">
            <div className="hidden md:flex md:w-3/4 bg-gray-100 flex-col items-center justify-start shadow-2xl">
                <div className=" h-1/12 md:w-full mt-5 px-4 rounded-3xl flex items-center justify-center">
                    <ExpenseForm />
                </div>
                <div className="scrollable-container w-full relative mt-4">
                    <ExpenseListing refreshGraph={fetchData}/>
                </div>
            </div>
            <div className="flex flex-col w-full md:w-1/4 items-center justify-center p-1">
                <div className="flex-1 w-full bg-red-100 flex items-center justify-center shadow-xl mb-1">
                    <Line data={graphData} options={options_line} className="hover:shadow-2xl rounded-lg hover:cursor-pointer" />
                </div>
                <div className="flex-1 w-full bg-blue-100 flex items-center justify-center shadow-xl mb-1">
                   <Bar data={barData} options={options_bar} className="hover:shadow-2xl rounded-lg hover:cursor-pointer" />
                </div>
            </div>
        </div>
    );
};  

export default Home;

