import { useState, useEffect } from 'react';
import React from "react";
import api from './api';

const ExpenseListing = () => {
    const [spending, setSpending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/django/create-or-list-spending-obj/');
                setSpending(response.data.response);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/django/delete-spending-obj/${id}/`);
            setSpending(spending.filter(item => item.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const handleEdit = (id) => {
        console.log(id);
    };

    return (
        <div className="table-container h-full">
            <table className="table-auto w-full ">
                <thead className="sticky top-0 !bg-gray-300">
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
                        <tr key={index} className="!bg-white hover:bg-indigo-300 hover:shadow text-center border-b border-gray-400">
                            <td className="px-4 py-2 border-r border-gray-400">{element.date}</td>
                            <td className="px-4 py-2 border-r border-gray-400">{element.reason}</td>
                            <td className="px-4 py-2 border-r border-gray-400">{element.category}</td>
                            <td className="px-4 py-2 border-r border-gray-400">{element.price}</td>
                            <td className="px-4 py-2 border-r border-gray-400 w-1/12">
                                <button
                                    onClick={() => handleDelete(element.id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full mr-2 hover:scale-110 transform transition duration-100"
                                >
                                    x
                                </button>
                                <button
                                    onClick={() => handleEdit(element.id)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full hover:scale-110 transform transition duration-100"
                                >
                                    E
                                </button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExpenseListing;
