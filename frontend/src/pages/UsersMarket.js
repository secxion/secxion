import React from 'react';
import UsersMarket from '../Components/UsersMarket';
import './UsersMarketPage.css'; 
const UsersMarketPage = () => {
  return (
    <div className="container">
      <h1 className="title">Users Uploaded Markets</h1>
      <UsersMarket />
    </div>
  );
}

export default UsersMarketPage;