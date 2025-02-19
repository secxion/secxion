import React from 'react';
import UsersMarket from '../Components/UsersMarket';

const UsersMarketPage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Users Uploaded Markets</h1>
      <UsersMarket />
    </div>
  );
}

export default UsersMarketPage;