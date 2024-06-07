import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import illustration from '../images/dollars.jpg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'user' && password === 'SURAJ12!@') {
      navigate('/dashboard');
    } else {
      setErrorMessage('Invalid credentials');
    }
  };

  return (
    <div className="flex w-full h-full ">
      <div className="flex w-full md:w-1/4 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-4">Spendwise</h1>
          <h2 className="text-xl font-medium text-center mb-6">One Transaction at a time</h2>
          <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md hover:scale-110 transform transition duration-200">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="username">
                Username or Email
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
                placeholder="David Brooks"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
                placeholder="********"
              />
              <div className="text-right text-sm mt-1">
                <a href="/forgot_password" className="text-blue-500 hover:underline">Forgot password?</a>
              </div>
            </div>
            {errorMessage && (
              <div className="text-red-500 text-sm mb-4">
                {errorMessage}
              </div> 
            )}
            <button
              type="submit"
              className="w-full py-2 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Sign In
            </button>
            <div className="text-center text-sm mt-4">
              <span>New to Spendwise?</span> <a href="/create_account" className="text-blue-500 hover:underline">Create Account</a>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden md:flex md:w-3/4 bg-green-100 items-center justify-center shadow-2xl">
        <img src={illustration} alt="Illustration" className="h-full w-full object-cover" />
      </div>
    </div>
  );
};

export default Login;
