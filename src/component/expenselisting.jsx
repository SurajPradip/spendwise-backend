import { useState, useEffect } from 'react';
import React from "react";
import api from './api';

const ExpenseListing = () => {
    const [spending, setSpending] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/django/create-or-list-spending-obj/');
                setSpending(response.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="table-container h-full">
            <table className="table-auto w-full bg-blue-200">
                <thead className="sticky top-0 bg-blue-300">
                    <tr>
                        <th className="px-4 py-2 text-center border border-black">Date</th>
                        <th className="px-4 py-2 text-center border border-black">Reason</th>
                        <th className="px-4 py-2 text-center border border-black">Category</th>
                        <th className="px-4 py-2 text-center border border-black">Price</th>
                        <th className="px-4 py-2 text-center border border-black">S-faction</th>
                    </tr>
                </thead>
                <tbody>
                    {spending.response && spending.response.map((element, index) => (
                        <tr key={index} className="bg-blue-200 hover:bg-indigo-300 hover:shadow text-center border-b border-gray-400">
                            <td className="px-4 py-2 border-r border-gray-400">{element.date}</td>
                            <td className="px-4 py-2 border-r border-gray-400">{element.reason}</td>
                            <td className="px-4 py-2 border-r border-gray-400">{element.category}</td>
                            <td className="px-4 py-2 border-r border-gray-400">{element.price}</td>
                            <td className="px-4 py-2">{element.age}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExpenseListing;
