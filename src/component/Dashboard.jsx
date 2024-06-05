import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import { Pie } from 'react-chartjs-2';
import { useState, useEffect } from 'react';


const Dashboard = () => {
  const [pieData,setPieData] = useState('')
  const navigate = useNavigate();
  const fetchPieData = async () =>{
    const pie_data = await api.get('/django/get-category-wise-expense/');
    if (pie_data.data.category_wise) {
      const pieData = {
          labels: pie_data.data.category_wise.labels,
          datasets: [{
              label: 'Expense',
              data: pie_data.data.category_wise.data,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',              ],
              fill: true,
          }],
    };
    setPieData(pieData);
  }
  };
  const goToExpense = ()=>{
    navigate('/expense')
  }

  useEffect(()=>{
    fetchPieData();
    console.log(pieData,'[[[[[[[[[[[[[[[[[[[[[')
  },[])    

  return (
    <div className="fixed top-0 left-0 h-screen w-screen bg-gray-100 overflow-auto">
      <div className="flex flex-col h-full">
        <header className="mx-8 rounded-lg shadow flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <div className="text-xl font-bold">Balance avg spending per day s-faction etc</div>
          <div className="flex items-center space-x-4">
            <div className="text-gray-500">Jun 4 22:26</div>
          </div>
        </header>
        <main className="flex h-full flex-1 px-6 py-4">
          <div className="flex flex-1 justify-between">
            <div className="w-1/2 space-y-4">
              <div className="bg-white hover:cursor-pointer rounded-lg shadow-md px-6 py-4 h-1/2 mx-2">
                <div className='relative h-full w-full hover:scale-105 transform transition duration-100 hover:z-10' onClick={goToExpense}>
                    <h3 className="text-xl  font-bold mb-2">Expense</h3>
                    <p className="text-2xl font-semibold">Pie chart of expenses and a list of latest transactions</p>
                    <div className=' flex w-full items-center justify-center h-3/4'>
                      <div className='w-1/3 items-center justify-center h-3/4 m-2'>
                        <Pie data={pieData} className="rounded-lg hover:cursor-pointer" />
                      </div>
                      <div className='w-1/2 items-center justify-center h-3/4 m-2'>

                      </div>
                    </div>

                </div>
              </div>
              <div className="bg-white hover:cursor-pointer rounded-lg shadow-md px-6 py-4 h-1/2 mx-2">
                <div className='relative h-full w-full hover:scale-105 transform transition duration-100 hover:z-10'>
                  <h3 className="text-xl  font-bold mb-2">Investments,trips and more </h3>
                  <p className="text-2xl font-semibold">Further divide the dic</p>
                  <div></div>
                </div>
              </div>
            </div>
            <div className="w-1/2 space-y-4">
              <div className="bg-white hover:cursor-pointer rounded-lg shadow-md px-6 py-4 h-1/2 mx-2">
                <div className='relative h-full w-full hover:scale-105 transform transition duration-100 hover:z-10'>
                  <h3 className="text-xl  font-bold mb-2">Incoming</h3>
                  <p className="text-2xl font-semibold">Latest incoming datas ( no graph)</p>
                  <div></div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md px-6 py-4 h-1/2 mx-2 group ">    
                <div className='relative hover:cursor-pointer h-full w-full hover:scale-105 transform transition duration-100 hover:z-10'>
                  <h3 className="text-xl  font-bold mb-2">Debts</h3>
                  <p className="text-2xl font-semibold">--</p>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;