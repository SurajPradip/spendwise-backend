import React from 'react';

const Navbar = () => {
  return (
    <nav className="w-full p-4 bg-gray-800 text-white flex justify-between shadow-2xl">
      <div className="text-xl font-bold">Spendwise</div>
      <div>
        <a href="/home" className="mr-4">Home</a>
        <a href="/profile" className="mr-4">Profile</a>
        <a href="/settings">Settings</a>
      </div>
    </nav>
  );
};

export default Navbar;
