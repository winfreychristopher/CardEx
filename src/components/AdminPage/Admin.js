import React from "react";
import { Link } from "react-router-dom";

import CreateCard from "./createCard";
import AllOrders from "./orders";
import './Admin.scss';

const AdminPage = () => {
  
  return (
    <>
      <h1> Admin Future Form Page </h1>
      <h1>Create/Patch new Card Listing</h1>
      <CreateCard />
      <h1> Customer Order List</h1>
      <AllOrders />
    </>
  );
};

export default AdminPage;
